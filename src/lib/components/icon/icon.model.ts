import { UIHelper } from '$lib/helper.js';
import { SvelteStore } from '$lib/store/index.js';
import { writable, type Writable } from 'svelte/store';

export interface IconParam {
  /**
   * icon - path of icon
   */
  icon: string | undefined;
  /**
   *
   * @default "mask"
   */
  type?: 'mask' | 'manual';
  /**
   * @default "sm"
   */
  size?: 'xs' | 'sm' | 'md';
  /**
   * extra samll size
   * @default "1rem"
   */
  xsSize?: string;
  /**
   * extra samll size
   * @default "1.2rem"
   */
  smSize?: string;
  /**
   * extra samll size
   * @default "1.4rem"
   */
  mdSize?: string;
  active?: boolean;
  /**
   * secify the icon sizes using array format. It has 3 value [string, number, number]
   *  - sizeRatio[0] is the size of xs icon like '1rem', '12px' etc.
   *  - sizeRatio[1] and sizeRatio[2] are proportions to `sizeRatio[0]` like `1.24`
   *
   * example
   *```svelte
   * <script>
   *  const iconRatio = ['0.9rem', 1.2, 1.4]
   * </scipt>
   *
   * <Icon ratio={iconRatio} size="xs" icon='/images/hover.svg'>
   * <Icon ratio={iconRatio} size="sm" icon='/images/close.svg'>
   * <Icon ratio={iconRatio} size="md" icon='/images/brand.svg'>
   *
   * * `hover.svg' is 0.9rem
   * * `close.svg` is 1.08rem
   * * `brand.svg` is 1.26rem
   * ```
   *
   * @default undefined
   * @override 'xsSize', 'smSize', 'mdSize'
   *
   */
  ratio?: [string, number, number] | undefined;
  /**
   * icon color.
   * If type is `mask`, it is background color for masking effect.
   * If type is `manual`, is is not used.
   */
  color?: string | undefined;
  spin?: boolean;
  rotate?: number;
}
export class IconModel extends SvelteStore<IconModel> implements IconParam {
  icon: string | undefined;
  type: 'mask' | 'manual' = 'mask';
  size: 'xs' | 'sm' | 'md' = 'sm';
  xsSize: string = '1rem';
  smSize: string = '1.2rem';
  mdSize: string = '1.4rem';
  active: boolean = false;
  ratio: [string, number, number] | undefined;
  color: string | undefined = undefined;
  spin: boolean = false;
  rotate: number = 0;
  protected store: Writable<IconModel> = writable(this);
  constructor() {
    super();
  }
  private _resize() {
    const { ratio } = this;
    if (!ratio) {
      return;
    }
    const xs = ratio[0];
    const [base, unit] = UIHelper.parseSizeUnit(xs);
    const sm = `${base * ratio[1]}${unit}`;
    const md = `${base * ratio[2]}${unit}`;
    this.xsSize = xs;
    this.smSize = sm;
    this.mdSize = md;
    this.ratio = [...ratio];
  }
  flush<K extends keyof IconParam>(key: K, value: IconParam[K], repaint: boolean = true) {
    (this as IconParam)[key] = value;
    if (key === 'ratio') {
      this._resize();
    }
    if (repaint) {
      this.update();
    }
  }
  static create(param: IconParam): IconModel {
    const model = new IconModel();

    UIHelper.keys(param)
      .filter((prop) => param[prop] !== undefined)
      .forEach((prop) => {
        (model[prop] as IconParam[keyof IconParam]) = param[prop];
      });
    model._resize();
    return model as IconModel;
  }
}
