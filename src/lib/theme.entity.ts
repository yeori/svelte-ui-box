import { UIHelper } from './helper.js';

export class ThemeEntity {
  /**
   *
   * ```
   * --{prefix}-{state}-{target}-{style}
   * ```
   * @param prefix
   * @param state
   * @param target
   * @param styles
   */
  constructor(
    readonly prefix: string,
    readonly target: string,
    readonly state: string | undefined,
    readonly styles: Partial<CSSStyleDeclaration>
  ) {}
  getVariabels() {
    const { prefix, target, state, styles } = this;
    const _state = state ? `-${state}` : '';
    const ref = `--${prefix}-${target}${_state}`;
    return UIHelper.parseCssDeclaration(styles, (prop) => `${ref}-${prop}`);
  }
  mergeVariables() {
    const { prefix, state, target, styles } = this;
    const ref = `--${prefix}-${target}-${state}`;
    return UIHelper.keys(styles)
      .map((prop) => {
        const key = UIHelper.camelToDashed(String(prop));
        const value = styles[prop] || 'unset';
        return `${ref}-${key}: ${value}`;
      })
      .join(';');
  }
}
