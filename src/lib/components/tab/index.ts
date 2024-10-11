import type { EventDispatcher } from 'svelte';
import type { SelectionModel } from '../model/index.js';

export { default as TabContent } from './TabContent.svelte';
export { default as TabNavBar } from './TabNavBar.svelte';
export { default as TabView } from './TabView.svelte';

export type TabContextType<K extends string | symbol> = {
  model: SelectionModel<K>;
  dispatch: EventDispatcher<Record<string, unknown>>;
};
