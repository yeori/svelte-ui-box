import type { ButtonModel } from './components/button/button.model.js';
import type { IconModel } from './components/index.js';
import { CssVar } from './cssvar.js';
import { UIHelper } from './helper.js';
import { ThemeDef } from './svelte.theme.js';

export class SvelteUiBox<C extends string> {
  private static FALLBACK = new SvelteUiBox('svelteuibox');
  readonly themes = new Map<string, ThemeDef<C>>();
  readonly sizes: Record<string, CssVar> = {};
  private _activeTheme: ThemeDef<C> | undefined;
  constructor(readonly prefix = 'svelteuibox') {}
  get theme() {
    return this._activeTheme;
  }
  newTheme(themName: string, asActive: boolean = false) {
    const theme = new ThemeDef<C>();
    this.themes.set(themName, theme);
    if (asActive) {
      this._activeTheme = theme;
    }
    return theme;
  }
  get colors() {
    return this.theme!.colors;
  }
  parseCssVar(style: Record<string, string>, target: string) {
    const prefix = `${this.prefix}-${target}`;
    return UIHelper.resolveStyles(style, prefix);
  }
  private setValue<T, K extends keyof T>(obj: T, prop: K, value: T[K]) {
    if (obj[prop] === undefined) {
      obj[prop] = value;
    }
  }
  resolveIconPath(model: IconModel) {
    const { theme } = this;
    return theme!.resolveIconPath(model);
  }
  resolveIcon(iconModel: IconModel) {
    const { theme } = this;
    return theme!.resolveIcon(iconModel);
  }
  resolveButton(buttonModel: ButtonModel): string {
    const { theme } = this;
    return theme!.resolveButton(buttonModel);
  }
  setSize(name: string, style: Record<string, string>) {
    this.sizes[name] = new CssVar(`${this.prefix}-${name}`, style);
    return this;
  }
  insallTheme(themeName: string, el: HTMLElement) {
    const theme = this.themes.get(themeName);
    if (theme) {
      theme.insallTheme(el);
    }
    Object.entries(this.sizes).forEach((elem) => {
      elem[1].getVariables().forEach(([prop, value]) => {
        el.style.setProperty(prop, value);
      });
    });
  }
  getButtonStyle(state: string) {
    const { theme } = this;
    return theme!.getButtonStyle(state);
  }
  static load<C extends string>(getContext: <T>(key: string) => T) {
    let ctx = getContext<SvelteUiBox<C>>('svelte-ui-box');
    if (!ctx) {
      ctx = SvelteUiBox.FALLBACK;
    }
    return ctx;
  }
  static register<C extends string>(
    uiBox: SvelteUiBox<C>,
    setContext: <T>(key: string, context: T) => T
  ) {
    setContext('svelte-ui-box', uiBox);
  }
}
