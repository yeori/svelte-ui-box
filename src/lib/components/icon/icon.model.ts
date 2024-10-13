import { UIHelper } from '$lib/helper.js';
import { SvelteStore } from '$lib/store/index.js';
import { UnitSizeList, type UnitSize } from '$lib/svelte.ui.type.js';
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
  type?: 'mask' | 'bg';
  /**
   * @default "sm"
   */
  size?: UnitSize | string;
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
  icon: string | undefined = undefined;
  type: 'mask' | 'bg' = 'mask';
  size: UnitSize | string = 'sm';
  ratio: [string, string, string] | undefined = undefined;
  color: string | undefined = undefined;
  spin: boolean = false;
  rotate: number = 0;
  protected store: Writable<IconModel> = writable(this);
  constructor() {
    super();
  }
  isCustomSize() {
    return !UnitSizeList.includes(this.size as UnitSize);
  }
  getSizeClass() {
    return this.isCustomSize() ? 'custom' : this.size;
  }
  flush<K extends keyof IconParam>(key: K, value: IconParam[K], repaint: boolean = true) {
    (this as IconParam)[key] = value;
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
    return model as IconModel;
  }
}
