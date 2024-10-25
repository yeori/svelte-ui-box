<script lang="ts">
  import { Button } from '../button/index.js';
  import type { ConfirmModalSpec } from './modal.util.js';
  import { modalContext, type ModalAction } from './modal.context.js';
  export let modalSpec: ConfirmModalSpec;

  const clicked = (action: ModalAction) => {
    modalSpec.actionHandler(action.event, action);
    setTimeout(() => {
      modalContext.pop();
    });
  };
</script>

<div class="confirm">
  <div class="msg">{modalSpec.message}</div>
  <div class="footer">
    <div class="actions">
      {#if modalSpec.actions}
        {#each modalSpec.actions as action}
          <Button param={{ label: action.text || action.event }} on:click={() => clicked(action)} />
        {/each}
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .confirm {
    .msg {
      margin: 16px;
    }
    .actions {
      margin: 16px;
      display: flex;
      justify-content: flex-end;
      column-gap: 8px;
    }
  }
</style>
