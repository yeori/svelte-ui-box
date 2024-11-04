<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ModalOption, modalContext } from './modal.context.js';
  import { UIHelper } from '$lib/helper.js';
  import { fade } from 'svelte/transition';
  import ModalHeader from './ModalHeader.svelte';

  export let modalOption: ModalOption;

  let actions = modalOption.getActions();

  let backdropEl: HTMLElement;
  const dispatcher = createEventDispatcher();

  const handleAction = (e: Event) => {
    const eventName = (e.target as HTMLElement).dataset.event;
    dispatcher('modal', { type: eventName });
  };
  const closeModal = () => {
    if (!modalOption.closable) {
      return;
    }
    if (modalOption.backdrop === true) {
      modalContext.moveBack();
    }
    dispatcher('modal', { type: 'close' });
  };
  const cssVar = () => {
    const css: Record<string, string> = {
      'backdrop-color': modalOption.backdrop ? '#0000004d' : '#00000000',
      shadow: modalOption.shadow ? '0 0 30px -8px #ffffff8c' : 'none',
      padding: modalOption.padding || '',
      zindex: modalOption.zIndex
    };
    const vars = UIHelper.buildCssVar(css, 'modal');
    return UIHelper.joinStyle(vars);
  };
</script>

<div
  data-modal-wrapper
  class="modal-wrapper"
  data-header={modalOption.headerVisible}
  style={cssVar()}
>
  <div
    role="button"
    aria-label="대화창 닫기"
    tabindex="0"
    class="backdrop"
    bind:this={backdropEl}
    transition:fade={{ duration: 100 }}
    on:click={closeModal}
    on:keyup={closeModal}
  />
  <div class:fullscreen={modalOption.fullscreen} class="modal-inner center {modalOption.width}">
    <dialog
      class:fullscreen={modalOption.fullscreen}
      class:height={modalOption.height}
      class:no-header={!modalOption.headerVisible}
      style="--modal-explicit-height: {modalOption.height}"
    >
      {#if modalOption.headerVisible}
        <ModalHeader {modalContext} {modalOption} />
      {/if}
      <div class="body" style="--modal-padding: {modalOption.padding}">
        <svelte:component this={modalOption.component} {...modalOption.args} />
      </div>
      {#if actions}
        <div class="footer" style="text-align: right};">
          {#each actions as btn}
            <button on:click={handleAction}>{btn.text}</button>
          {/each}
        </div>
      {:else}
        <div />
      {/if}
    </dialog>
  </div>
</div>

<style lang="scss">
  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: var(--modal-zindex, 500);
    .backdrop {
      background-color: var(--modal-backdrop-color);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .modal-inner {
      position: relative;
      width: 100%;
      background: var(--svelteuibox-modal-normal-background, inherit);
      color: var(--svelteuibox-modal-normal-color, inherit);
      &.center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &.sm {
        max-width: 360px;
      }
      &.md {
        max-width: 540px;
      }
      &.lg {
        max-width: 720px;
      }
      &.fullscreen {
        max-width: 100%;
        height: 100%;
        overflow: hidden;
      }
      dialog {
        display: block;
        position: relative;
        width: 100%;
        border: none;
        color: var(--svelteuibox-base-normal-color);
        box-shadow: var(--modal-shadow);
        box-sizing: border-box;
        padding: 0;
        background: inherit;
        &.fullscreen {
          height: 100%;
          overflow-y: hidden;
          overflow-x: hidden; // IOS-fix
          display: grid;
          grid-template-rows: min-content 1fr min-content;
          &.no-header {
            grid-template-rows: 1fr min-content;
          }
        }
        &.height {
          height: var(--modal-explicit-height);
        }
        .body,
        .footer {
          padding: var(--modal-padding);
        }
        .body {
          height: 100%;
          overflow-y: auto;
        }
        .footer {
          button + button {
            margin-left: 8px;
          }
        }
      }
    }
  }
</style>
