import { SvelteStore } from '$lib/store/index.js';
import type { UnitSize } from '$lib/svelte.ui.type.js';
import { writable } from 'svelte/store';
import { type IconParam } from '../icon/icon.model.js';
import { UIHelper } from '$lib/helper.js';

export type ChipParam = {
  theme?: string;
  label: string;
  /**
   * "xs" | "sm" | "md", or custome size like "14px", "2rem"
   * @default "sm"
   */
  size?: UnitSize | string;
  disabled?: boolean;
  /**
   * left icon
   */
  icon?: string | IconParam | false;
  /**
   * icon path
   */
  closable?: string;
  /**
   * style attributes to be injected into the button
   */
  style?: Partial<CSSStyleDeclaration>;
  /**
   * value for `border-radius`(ex 0.75rem, 24px, etc)
   */
  round?: string | undefined;
  border?: boolean;
  outline?: boolean;
};

export class ChipModel extends SvelteStore<ChipModel> implements ChipParam {
  theme?: string | undefined;
  label: string = 'Chip';
  size: string = 'sm';
  disabled: boolean = false;
  icon: string | false | IconParam = false;
  closable: string | undefined;
  style: Partial<CSSStyleDeclaration> | undefined;
  round: string = '2rem';
  border: boolean = true;
  outline?: boolean = false;
  protected store = writable(this as ChipModel);
  constructor() {
    super();
  }
  static create(param: ChipParam): ChipModel {
    const model = new ChipModel();
    UIHelper.keys(param)
      .filter((prop) => param[prop] !== undefined)
      .forEach((prop) => {
        (model[prop] as ChipParam[keyof ChipParam]) = param[prop];
      });
    return model;
  }
}
