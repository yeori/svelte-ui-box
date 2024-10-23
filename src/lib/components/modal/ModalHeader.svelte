<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ActionIcon } from '../icon/index.js';
  import type { ModalAction, ModalContext, ModalOption } from './modal.context.js';

  export let modalContext: ModalContext;
  export let modalOption: ModalOption;
  export let dispatch = createEventDispatcher();

  const dispatchAction = (action: ModalAction) => {
    const { event } = action;
    dispatch(action.event as string, { event });
  };

  const back = () => {
    if (modalOption.closable) {
      modalContext.moveBack();
    }
  };
</script>

<h3 class="head">
  <ActionIcon
    param={{
      icon: { icon: modalOption.closeIcon, color: 'var(--svelteuibox-base-normal-color)' },
      size: 'md',
      style: { background: 'var(--svelteuibox-base-normal-background)' }
    }}
    on:click={back}
  /><span class="bread-crum">{modalOption && modalOption.title}</span>
  <div class="header-actions">
    {#key modalOption}
      {#each modalOption.headerActions || [] as action}
        <ActionIcon
          param={{
            icon: { icon: action.icon, color: 'var(--svelteuibox-base-normal-color)' },
            style: { background: 'var(--svelteuibox-base-normal-background)' }
          }}
          on:click={() => dispatchAction(action)}
        />
      {/each}
    {/key}
  </div>
</h3>

<style lang="scss">
  .head {
    display: flex;
    align-items: center;
    padding: 8px;
    user-select: none;
    margin: 0;
    .bread-crum {
      flex: 1 1 auto;
    }
    .header-actions {
      display: flex;
    }
  }
</style>
