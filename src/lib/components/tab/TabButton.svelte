<script lang="ts" generics="K extends string | symbol">
  import type { TabContextType } from './index.js';

  import { getContext } from 'svelte';
  import type { SelectionItem } from '../model/selection/index.js';

  export let tab: SelectionItem<K>;
  export let useDefaultDesign: boolean = true;

  const { model } = getContext<TabContextType<K>>('model');

  if (useDefaultDesign) {
    import('./_tab.button.scss');
  }
</script>

<button
  class="tab-btn"
  class:active={$model.isActive(tab.key)}
  on:click={() => model.selectTab(tab)}>{tab.label}</button
>
