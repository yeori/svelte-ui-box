<script lang="ts" generics="K extends string | symbol">
	import type { TabContextType } from './index.js';
	import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';

	import TabButton from './TabButton.svelte';
	import { getContext } from 'svelte';
	/**
	 * svelte component to use for each of tabs
	 * @optional
	 */
	export let button: ComponentType<SvelteComponent> = TabButton;
	/**
	 * properties to be passed to `button` component if it exists.
	 * @optional
	 */
	export let props: ComponentProps<InstanceType<typeof button>> = {};

	const { model } = getContext<TabContextType<K>>('model');
</script>

<!--
	@component
	
  Navigation placeholder for tab buttons.
  
  ### props
  1. button(optional) - SvelteComponent you want to use for tab item.
  1. props(optional) - if `button` is provided, `props` ars passed into component `button`.
-->

<nav>
	{#each $model.items as tab}
		<svelte:component this={button} {...{ tab, ...props }} />{/each}
</nav>

<style lang="scss">
	nav {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: flex-end;
	}
</style>
