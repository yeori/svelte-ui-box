<script lang="ts" generics="K extends string | symbol">
  import type { TabContextType } from './index.js';

  import { fade } from 'svelte/transition';

  import { getContext } from 'svelte';
  import type { SelectionModel } from '../model/selection/selection.model.js';

  export let key: K;
  let transition: boolean = false;
  const { model } = getContext<TabContextType<K>>('model');

  const once = (model: SelectionModel<K>) => {
    transition = model.isActive(key);
    if (transition) {
      setTimeout(() => {
        transition = false;
      }, 200);
    }
  };
  $: once($model);
</script>

{#if $model.isActive(key)}
  <div class:tr={transition} in:fade={{ duration: 200 }}>
    <slot />
  </div>
{/if}

<style lang="scss">
  div {
    display: contents;
    &.tr {
      display: block;
    }
  }
</style>
