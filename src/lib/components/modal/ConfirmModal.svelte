<script lang="ts">
  import type { ConfirmModalSpec } from './modal.util.js';

  export let modalSpec: ConfirmModalSpec;
</script>

<div class="confirm">
  {#if modalSpec.title}
    <h3>{modalSpec.title}</h3>
  {/if}
  <div class="msg">{modalSpec.message}</div>
  <div class="footer">
    <div class="actions">
      {#each modalSpec.actions as action}
        <button class="btn" on:click={() => modalSpec.actionHandler(action.event, action)}
          >{action.text}</button
        >
      {/each}
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
      text-align: right;
    }
  }
</style>
