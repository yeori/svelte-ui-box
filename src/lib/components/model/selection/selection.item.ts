import type { ComponentType, SvelteComponent } from 'svelte';

export type TabContentOption = {
	ui: ComponentType<SvelteComponent>;
	props?: Record<string, unknown | (() => unknown)>;
	events?: Record<string, () => void>;
};
export type SelectionItemLiteral<K extends string | symbol | number, D = never> = {
	key: K;
	label: string;
	userData?: D;
	content?: TabContentOption;
};
export class SelectionItem<K, D = never> {
	constructor(
		readonly key: K,
		public label: string,
		readonly userData?: D,
		readonly content?: TabContentOption
	) {}
	equals(other: SelectionItem<K, D>): boolean {
		return this.key === other.key;
	}
	getProps() {
		const props = this.content?.props;
		if (props) {
			const value: Record<string, unknown> = {};
			Object.keys(props).forEach((name) => {
				if (typeof props[name] === 'function') {
					value[name] = props[name]();
				} else {
					value[name] = props[name];
				}
			});
			return value;
		} else {
			return {};
		}
	}
}
