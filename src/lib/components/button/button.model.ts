import { UIHelper } from '$lib/helper.js';
import { SvelteStore } from '$lib/store/index.js';
import { writable, type Writable } from 'svelte/store';
import { IconModel, type IconParam } from '../icon/icon.model.js';
import type { PendingParam, UnitSize } from '$lib/svelte.ui.type.js';

export type ButtonState = 'normal' | 'hover' | 'active' | 'disable';

export class PendingModel {
  readonly iconParam: IconParam | undefined;
  readonly text: string | undefined;
  constructor(
    readonly param: PendingParam,
    model: ButtonModel
  ) {
    const { icon, timeout, text } = param;
    if (icon) {
      this.iconParam = typeof icon === 'string' ? { icon, size: model.size, spin: true } : icon;
    } else if (text) {
      this.text = text;
    } else {
      this.text = 'Pending';
    }
    if (timeout === undefined) {
      param.timeout = 0;
    }
  }
  hasIcon() {
    return !!this.iconParam;
  }
}
export type ButtonParam = {
  theme?: string;
  type?: 'button' | 'toggle';
  className?: Record<ButtonState, string>;
  label: string;
  /**
   * "xs" | "sm" | "md", or custome size like "14px", "2rem"
   * @default "sm"
   */
  size?: UnitSize | string;
  disabled?: boolean;
  icon?: string | IconParam | false;
  /**
   * style attributes to be injected into the button
   */
  style?: Partial<CSSStyleDeclaration>;
  /**
   * value for `border-radius`(ex 0.75rem, 24px, etc)
   */
  round?: string | undefined;
};
export type IconButtonParam = Omit<ButtonParam, 'label'>;

const DEFAULT_CLASS_NAMES: Record<ButtonState, string> = {
  normal: 'normal',
  hover: 'hover',
  active: 'active',
  disable: 'disable'
};
export class ButtonModel extends SvelteStore<ButtonModel> implements ButtonParam {
  theme?: string;
  type: 'button' | 'toggle' = 'button';
  className: Record<ButtonState, string> = DEFAULT_CLASS_NAMES;
  label: string = 'BUTTON';
  size: UnitSize | string = 'sm';
  pending: PendingModel | undefined;
  disabled: boolean = false;
  icon?: string | IconParam = undefined;
  style?: Partial<CSSStyleDeclaration>;
  round?: string | undefined;

  private _toggled: boolean = false;
  _state: ButtonState = 'normal';
  _iconParam?: IconParam = undefined;
  _iconModel?: IconModel = undefined;

  _error?: string;

  protected store: Writable<ButtonModel> = writable(this);
  constructor() {
    super();
  }
  get iconParam() {
    return this._iconParam!;
  }
  get toggled() {
    return this._toggled;
  }
  get pendingState() {
    return !!this.pending;
  }
  get error() {
    return this._error;
  }
  private _installIcon() {
    const { icon } = this;
    if (icon) {
      this._iconParam = typeof icon === 'string' ? { icon } : icon;
    }
  }
  flush<K extends keyof ButtonParam>(prop: K, value: ButtonParam[K], repaint: boolean = true) {
    const old = this[prop];

    (this[prop] as ButtonParam[keyof ButtonParam]) = value;
    if (repaint) {
      this.update();
    }
    return old;
  }
  setPending(pending: PendingParam) {
    this.pending = new PendingModel(pending, this);
    this.update();
    return (errorMessage?: string) => {
      if (errorMessage) {
        this._error = errorMessage;
      }
      this.pending = undefined;
      this.update();
    };
  }
  resolveClassName(): string {
    const { className } = this;
    const cnames = [];
    if (this.disabled) {
      cnames.push(className.disable);
    } else if (this._toggled) {
      cnames.push(className.active);
    }
    if (this.round) {
      cnames.push('round');
    }
    cnames.push(this.size);
    return cnames.join(' ');
  }
  isToggleButton() {
    return this.type === 'toggle';
  }
  toggle() {
    if (!this.isToggleButton()) {
      return;
    }
    this._toggled = !this._toggled;
    this.update();
  }
  clearError() {
    if (this._error) {
      this._error = undefined;
      this.update();
    }
  }
  hasIcon() {
    return !!this._iconParam;
  }
  hasError() {
    return !!this._error;
  }
  setIconModel(iconModel: IconModel) {
    this._iconModel = iconModel;
  }
  static createIconButton(param: IconButtonParam) {
    const btnParam = Object.assign({}, param) as ButtonParam;
    btnParam.label = '';
    return this.create(btnParam);
  }
  static create(param: ButtonParam) {
    const model = new ButtonModel();
    UIHelper.keys(param)
      .filter((prop) => param[prop] !== undefined)
      .forEach((prop) => {
        (model[prop] as ButtonParam[keyof ButtonParam]) = param[prop];
      });
    model._installIcon();
    return model;
  }
}
