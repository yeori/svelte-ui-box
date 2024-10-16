<script lang="ts" strictEvents>
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import { ButtonModel, type ButtonParam } from './button.model.js';
  import Icon from '../icon/Icon.svelte';
  import { SvelteUiBox } from '$lib/svelte.ui.box.js';
  import { fly } from 'svelte/transition';

  export let test: string | undefined = undefined;
  export let param: ButtonParam;
  export let dispatch = createEventDispatcher<{
    model: ButtonModel;
    click: ButtonModel;
    toggle: ButtonModel;
  }>();

  const ctx = SvelteUiBox.load(getContext);
  const model = ButtonModel.create(param);
  const { iconParam } = model;
  if (iconParam) {
    const entity = ctx.getButtonStyle('normal');
    if (iconParam.color === undefined) {
      if (model.style?.color) {
        iconParam.color = model.style.color;
      } else {
        iconParam.color = entity?.styles.color;
      }
    }
    if (iconParam.size === undefined) {
      iconParam.size = model.size;
    }
  }

  const clicked = () => {
    const toggleBtn = model.isToggleButton();
    if (toggleBtn) {
      model.toggle();
    }
    const eventName = toggleBtn ? 'toggle' : 'click';
    dispatch(eventName, model);
  };
  const assignTestId = (el: HTMLButtonElement) => {
    if (test) {
      el.dataset.testid = test;
    }
  };
  onMount(() => {
    dispatch('model', model);
  });
</script>

<button
  on:click={clicked}
  use:assignTestId
  class={$model.resolveClassName()}
  class:has-icon={$model.hasIcon()}
  disabled={$model.disabled || $model.pendingState}
  style={ctx.resolveButton(model)}
  ><span class="inner"
    >{#if $model.hasIcon()}<Icon
        param={$model.iconParam}
        on:model={(e) => model.setIconModel(e.detail)}
      ></Icon>{/if}<span class="lbl">{$model.label}</span></span
  >{#if $model.pending}
    <span class="pending"
      >{#if $model.pending.iconParam?.icon}<span
          in:fly|global={{ duration: 200, x: -40 }}
          out:fly|global={{ duration: 200, x: 40, delay: 100 }}
          ><Icon param={$model.pending.iconParam}></Icon></span
        >{:else}<span class="text">{$model.pending.text}</span>{/if}</span
    >
  {/if}{#if $model.hasError()}
    <button class="error" on:click|stopPropagation={() => model.clearError()}
      ><span class="msg">{$model.error}</span></button
    >{/if}</button
>

<style lang="scss">
  button {
    position: relative;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    border: none;
    border: none;
    padding: var(--svelteuibox-button-padding);
    color: var(--svelteuibox-button-normal-color);
    background-color: var(--svelteuibox-button-normal-background);
    border: 1px solid transparent;
    cursor: pointer;
    overflow: hidden;
    &:before {
      content: '';
      display: inline-block;
    }
    &:hover {
      color: var(--svelteuibox-button-hover-color, inherit);
      background-color: var(--svelteuibox-button-hover-background, inherit);
    }
    &:active:not(:disabled),
    &.active {
      color: var(--svelteuibox-button-active-color, inherit);
      background-color: var(--svelteuibox-button-active-background, inherit);
      & > .inner {
        transform: translate(1px, 1px);
      }
    }
    &:disabled {
      cursor: not-allowed;
      color: var(--svelteuibox-button-disable-color, inherit);
      background-color: var(--svelteuibox-button-disable-background, inherit);
    }
    &.round {
      border-radius: var(--svelteuibox-button-border-radius, 0);
    }
    &.xs {
      font-size: var(--svelteuibox-button-font-size-xs);
      padding: var(--svelteuibox-button-padding-xs);
      &.has-icon {
        > .inner {
          column-gap: 4px;
        }
      }
    }
    &.sm {
      font-size: var(--svelteuibox-button-font-size-sm);
      padding: var(--svelteuibox-button-padding-sm);
      &.has-icon {
        > .inner {
          column-gap: 6px;
        }
      }
    }
    &.md {
      font-size: var(--svelteuibox-button-font-size-md);
      padding: var(--svelteuibox-button-padding-md);
      &.has-icon {
        > .inner {
          column-gap: 8px;
        }
      }
    }
    > .inner {
      display: flex;
      > .lbl {
        flex: 1 1 auto;
      }
    }
    > .pending {
      position: absolute;
      inset: 0;
      background-color: #ffffff9d;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        position: absolute;
        transform: translateX(-50%);
        color: #444;
        font-size: 10px;
        animation: bouncing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite alternate;
      }
    }
    > .error {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;

      > .msg {
        background-color: crimson;
        font-size: 10px;
        color: white;
        padding: 2px;
      }
    }
  }
  @keyframes bouncing {
    0% {
      left: 0;
    }
    100% {
      left: 100%;
    }
  }
</style>
