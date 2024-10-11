export class UIHelper {
  static resolveStyles(obj: Record<string, string>, prefix: string = ''): string {
    const prefixName = prefix ? `${prefix}-` : '';
    return Object.entries(obj)
      .map(([name, value]) => {
        return `--${prefixName}${name}: ${value}`;
      })
      .join(';');
  }
  static parseSizeUnit = (value: string): [number, string] => {
    const regex = /^(\d*\.?\d+)([a-zA-Z%]+)$/;
    const match = value.trim().match(regex);

    if (match) {
      const num = Number.parseFloat(match[1]);
      const unit = match[2];
      return [num, unit];
    } else {
      return [1, 'rem'];
    }
  };
  /**
   * It replaces `Objec.keys()`
   * @param src
   * @returns
   */
  static keys<K extends object>(src: K) {
    return Object.keys(src) as (keyof K)[];
  }
  static concatPath(...pathes: string[]): string {
    return pathes
      .filter((path) => path.trim().length > 0)
      .map((path, index) => {
        path = path.trim();
        if (index > 0) {
          path = path.replace(/^\/+/, '');
        }
        if (index < pathes.length - 1) {
          path = path.replace(/\/+$/, '');
        }
        return path;
      })
      .join('/');
  }
}
