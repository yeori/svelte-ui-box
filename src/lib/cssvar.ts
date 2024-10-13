export class CssVar {
  constructor(
    readonly prefix: string,
    readonly variables: Record<string, string>
  ) {}
  getVariables() {
    return Object.keys(this.variables).map((prop) => {
      const key = `--${this.prefix}-${prop}`;
      return [key, this.variables[prop]];
    });
  }
}
