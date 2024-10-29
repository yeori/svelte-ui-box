import { UIHelper } from '$lib/helper.js';
import { SvelteStore } from '$lib/store/index.js';
import type { SvelteUiBox } from '$lib/svelte.ui.box.js';
import { writable } from 'svelte/store';

export type SwitchParam = {
  width: string;
  height?: string;
  checked?: boolean;
  confirm?: (nextState: boolean, currentState?: boolean) => Promise<boolean>;
};

export class SwitchModel extends SvelteStore<SwitchModel> implements SwitchParam {
  protected store = writable(this as SwitchModel);
  readonly uuid: string;
  private _checked: boolean = true;
  constructor(
    readonly param: SwitchParam,
    readonly ctx: SvelteUiBox<string>
  ) {
    super();
    this.uuid = ctx.createUuid('swtch');
    this._checked = this.param.checked === undefined ? true : this.param.checked;
  }
  get width() {
    return this.widthText;
  }
  get widthText() {
    const [size, unit] = UIHelper.parseSizeUnit(this.param.width);
    return `${size}${unit}`;
  }
  get heightText() {
    const { height, width } = this.param;
    const [sz, unit] = UIHelper.parseSizeUnit(height || width);
    if (height) {
      return `${sz}${unit}`;
    } else {
      return `${sz / 2}${unit}`;
    }
  }
  get checked() {
    return this._checked;
  }
  set checked(checked: boolean) {
    if (this.param.confirm) {
      this.param.confirm(checked, this._checked).then((allow) => {
        if (allow) {
          this._checked = checked;
          this.update();
        }
      });
    }
  }
  get heightData(): [number, string] {
    const { height, width } = this.param;
    const [sz, unit] = UIHelper.parseSizeUnit(height || width);
    const size = height === undefined ? sz / 2 : sz;
    return [size, unit];
  }
  resovleCssVars(): string {
    const cssVars: Record<string, string> = {};
    cssVars['switch-width'] = this.widthText;
    cssVars['switch-height'] = this.heightText;

    const [height, unit] = this.heightData;
    const gap = Math.max(3, Math.floor(height * 0.05));
    const labelSize = height - 2 * gap;
    cssVars['switch-label-size'] = `${labelSize}${unit}`;
    cssVars['switch-label-gap'] = `${gap}${unit}`;

    return UIHelper.resolveStyles(cssVars, this.ctx.prefix);
  }
  static fromParam(param: SwitchParam, ctx: SvelteUiBox<string>) {
    return new SwitchModel(param, ctx);
  }
}
