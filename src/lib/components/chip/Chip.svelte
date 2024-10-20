<script lang="ts" generics="U">
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import ActionIcon from '../icon/ActionIcon.svelte';
  import { ChipModel, type ChipParam } from './chip.model.js';
  import { SvelteUiBox } from '$lib/svelte.ui.box.js';

  export let param: ChipParam<U>;

  const ctx = SvelteUiBox.load(getContext);
  const model = ChipModel.create(param);

  export let dispatch = createEventDispatcher<{
    model: ChipModel;
    click: ChipModel;
    close: ChipModel;
  }>();
  onMount(() => {
    dispatch('model', model);
  });
</script>

<button
  class="chip"
  class:outline={$model.outline}
  class:border={$model.border}
  disabled={$model.disabled}
  style={ctx.resolveChip(model)}
  on:click={() => dispatch('click', model)}
>
  <span class="inner {$model.size}" class:has-close={!!$model.closable}>
    <span class="text">{$model.label}</span>{#if $model.closable}<ActionIcon
        stop
        on:click={() => dispatch('close', model)}
        param={{
          icon: {
            icon: $model.closable,
            color: model.outline
              ? 'var(--svelteuibox-chip-normal-background)'
              : 'var(--svelteuibox-chip-normal-color)'
          },
          size: $model.size,
          style: {
            background: model.outline
              ? 'var(--svelteuibox-chip-normal-color)'
              : 'var(--svelteuibox-chip-normal-background)'
          }
        }}
      />{/if}</span
  >
</button>

<style lang="scss">
  .chip {
    border-radius: 5rem;
    color: var(--svelteuibox-chip-normal-color);
    white-space: nowrap;
    align-items: center;
    line-height: 1;
    background: var(--svelteuibox-chip-normal-background);
    padding: 0;
    cursor: pointer;
    border: none;
    overflow: hidden;
    &:disabled {
      color: var(--ssda-common-text-disabled-color);
      border-color: var(--ssda-common-text-disabled-color);
    }
    &.border {
      border: var(--svelteuibox-chip-normal-border);
    }
    &.outline {
      color: var(--svelteuibox-chip-normal-background);
      background: var(--svelteuibox-chip-normal-color);
    }
    &:active {
      .inner {
        transform: translate(1px, 1px);
      }
    }
    .inner {
      line-height: 1;
      display: inline-flex;
      align-items: center;
      overflow: hidden;
      .text {
        white-space: nowrap;
        line-height: 1;
        padding: 0 6px;
      }
      &.xs {
        font-size: var(--svelteuibox-chip-font-size-xs);
        padding: var(--svelteuibox-chip-padding-xs);

        &.has-close {
          padding: 0;
          > .text {
            padding: 0 0 0 8px;
          }
        }
      }
      &.sm {
        font-size: var(--svelteuibox-chip-font-size-sm);
        padding: var(--svelteuibox-chip-padding-sm);

        &.has-close {
          padding: 0;
          > .text {
            padding: 0 0 0 10px;
          }
        }
      }
      &.md {
        font-size: var(--svelteuibox-chip-font-size-md);
        padding: var(--svelteuibox-chip-padding-md);
        &.has-close {
          padding: 0;
          > .text {
            padding: 0 0 0 12px;
          }
        }
      }
    }
  }
</style>
