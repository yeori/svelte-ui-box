import { writable, type Writable } from 'svelte/store';
import { SelectionItem, type SelectionItemLiteral } from './selection.item.js';
import { SvelteStore } from '$lib/store/index.js';

const checkDuplicatedKey = <K extends number | string | symbol>(
  items: SelectionItemLiteral<K>[]
) => {
  const ids = new Set<K>();
  items.forEach(({ key }) => {
    if (ids.has(key)) {
      throw new Error(`key should be unique. [${String(key)}]`);
    }
    ids.add(key);
  });
};
/**
 *
 */
export class SelectionModel<K extends string | symbol | number> extends SvelteStore<
  SelectionModel<K>
> {
  protected store: Writable<SelectionModel<K>>;
  private _index: number;
  private _Keys: Record<K, K>;
  constructor(private readonly _items: SelectionItem<K>[]) {
    super();
    this.store = writable(this);
    this._index = 0;
    this._Keys = this.listTabId();
  }
  /**
   * all items
   */
  get items() {
    return this._items;
  }
  /**
   * active tab
   */
  get activeTab() {
    return this._items[this._index];
  }
  /**
   * list of keys
   */
  get keys() {
    return this._Keys;
  }
  /**
   * check if the given tab is active(visible)
   * @param tabId tab key for checking active state
   * @returns
   */
  isActive(tabId: K): boolean {
    return this._index === this._items.findIndex((item) => item.key === tabId);
  }
  private _selectByIndex(index: number, strict: boolean = false) {
    if (index < 0) {
      if (strict) {
        throw new Error(
          `out of index tab: ${index}, check the range [0, ${this._items.length - 1}]`
        );
      }
      return;
    }
    this._index = index;
    this.update();
  }
  /**
   * makes the given tab active(visible)
   * @param item tab to visible
   * @param strict if true, it throw error when no tab found.
   * @returns
   */
  selectItem(item: SelectionItem<K>, strict: boolean = false) {
    const idx = this._items.findIndex((elem) => elem.equals(item));
    this._selectByIndex(idx, strict);
  }
  /**
   * find tab to become active.
   * @param predicate
   * @param strict if true, it throw error when no tab found.
   */
  selectBy(predicate: (tab: SelectionItem<K>) => boolean, strict: boolean = false) {
    const idx = this._items.findIndex(predicate);
    this._selectByIndex(idx, strict);
  }
  listTabId(): Record<K, K> {
    return this._items.reduce(
      (obj, item) => {
        obj[item.key] = item.key;
        return obj;
      },
      {} as Record<K, K>
    );
  }
  /**
   * It build model instance from the given liternal definition.
   *
   * @template K type of unique key for each selectable items.
   * @param items liternal forms for items
   * @returns model instance
   */
  static build<K extends string | symbol | number>(
    ...items: SelectionItemLiteral<K>[]
  ): SelectionModel<K> {
    checkDuplicatedKey(items);
    const tabItems = items.map(
      ({ key, label, userData, content }) => new SelectionItem<K>(key, label, userData, content)
    );
    return new SelectionModel<K>(tabItems);
  }
}
