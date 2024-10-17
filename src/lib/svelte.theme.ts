import type { ButtonModel, ButtonState } from './components/button/button.model.js';
import type { ChipModel } from './components/chip/chip.model.js';
import type { IconParam, IconModel } from './components/index.js';
import { UIHelper } from './helper.js';
import type { ColorDef } from './svelte.ui.type.js';
import { ThemeEntity } from './theme.entity.js';

export class ThemeDef<C extends string> {
  readonly icons: Record<string, IconParam>;
  readonly buttons: ThemeEntity[] = [];
  readonly chips: ThemeEntity[] = [];
  readonly colorSet: Record<C, ColorDef> = {} as Record<C, ColorDef>;
  constructor(readonly prefix = 'svelteuibox') {
    this.icons = {};
  }
  setColor(color: Record<C, ColorDef>) {
    Object.assign(this.colorSet, color);
  }
  get colors() {
    return this.colorSet;
  }
  parseCssVar(style: Record<string, string>, target: string) {
    const prefix = `${this.prefix}-${target}`;
    return UIHelper.buildCssVar(style, prefix);
  }
  setIcon(prefix: string, iconParam: IconParam) {
    const { icon } = iconParam;
    if (icon !== '' && !icon) {
      throw new Error(
        `Icon definition needs valid icon. If you mean empty icon, use empty string like {icon: "" }`
      );
    }
    this.icons[prefix] = iconParam;
  }
  setDefaultIcon(iconParam: IconParam) {
    this.setIcon('default', iconParam);
  }
  private setValue<T, K extends keyof T>(obj: T, prop: K, value: T[K]) {
    if (obj[prop] === undefined) {
      obj[prop] = value;
    }
  }
  resolveIconPath(model: IconModel) {
    const { icon } = model;
    if (icon) {
      let [prefix, path] = icon.split(':');
      if (!path) {
        path = prefix;
        prefix = 'default';
      }
      const defaultIcon = this.icons[prefix];
      if (defaultIcon) {
        return UIHelper.concatPath(defaultIcon.icon!, path);
      } else {
        return path;
      }
    } else {
      return icon;
    }
  }
  resolveIcon(model: IconModel) {
    if (!model.icon) {
      throw Error('icon required');
    }
    let [prefix, icon] = model.icon.split(':');
    if (!icon) {
      icon = prefix;
      prefix = 'default';
    }
    const defaultIcon = this.icons[prefix];
    if (defaultIcon) {
      (
        [
          'color',
          'ratio',
          'xsSize',
          'smSize',
          'mdSize',
          'type',
          'active',
          'spin',
          'rotate'
        ] as (keyof IconParam)[]
      ).forEach((prop) => {
        this.setValue(model, prop, defaultIcon[prop]);
      });
    }

    const path = this.resolveIconPath(model);
    const { rotate, color } = model;
    const customStyle: Record<string, string> = {
      rotate: `${rotate}deg`
    };
    if (path) {
      customStyle['path'] = `url(${path})`;
    } else {
      model.flush('type', 'bg', false);
    }
    const { round } = model;
    if (round) {
      customStyle['border-raduis'] = round;
    }
    if (model.type === 'mask') {
      customStyle['background-color'] = color || '#777';
    }
    if (model.isCustomSize()) {
      customStyle['custom-size'] = model.size;
    }
    const cssVar = this.parseCssVar(customStyle, 'icon');
    const { style } = model;
    if (style) {
      UIHelper.parseCssDeclaration(style).reduce((style, [prop, value]) => {
        style[prop] = value;
        return style;
      }, cssVar);
    }
    return UIHelper.joinStyle(cssVar);
  }
  resolveButton(model: ButtonModel): string {
    const views = [];
    const { round } = model;
    const customSize: Record<string, string> = {};
    if (round) {
      customSize['button-border-radius'] = round;
    }
    const { style } = model;
    if (style) {
      const pairs = UIHelper.parseCssDeclaration(style);
      views.push(...pairs.map((pair) => `${pair[0]}: ${pair[1]}`));
    }
    const size = UIHelper.resolveStyles(customSize, this.prefix);
    views.push(size);
    return views.join(';');
  }
  resolveChip(model: ChipModel): string {
    const views = [];
    const { round } = model;
    const customSize: Record<string, string> = {};
    if (round) {
      customSize['chip-border-radius'] = round;
    }
    const { style } = model;
    if (style) {
      const pairs = UIHelper.parseCssDeclaration(style);
      views.push(...pairs.map((pair) => `${pair[0]}: ${pair[1]}`));
    }
    const size = UIHelper.resolveStyles(customSize, this.prefix);
    views.push(size);
    return views.join(';');
  }
  setStyle(def: {
    button?: Record<ButtonState, Partial<CSSStyleDeclaration>>;
    chip?: Partial<CSSStyleDeclaration>;
  }) {
    if (def.button) {
      const styleDef = def.button;
      const entities = UIHelper.keys(styleDef).map((state) => {
        const style = styleDef[state];
        return new ThemeEntity(this.prefix, 'button', state, style);
      });
      this.buttons.push(...entities);
    }
    if (def.chip) {
      this.chips.push(new ThemeEntity(this.prefix, 'chip', 'normal', def.chip));
    }
  }
  insallTheme(el: HTMLElement) {
    const button = this.buttons.flatMap((entity) => entity.getVariabels());
    const chip = this.chips.flatMap((entity) => entity.getVariabels());

    [...button, ...chip].forEach(([k, v]) => {
      el.style.setProperty(k, v);
    });
  }
  getButtonStyle(state: string) {
    return this.buttons.find((entity) => entity.state === state);
  }
}
