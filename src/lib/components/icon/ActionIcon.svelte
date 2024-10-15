<script lang="ts" strictEvents>
  import { createEventDispatcher, getContext } from 'svelte';
  import { ButtonModel, type IconButtonParam } from '../button/index.js';
  import Icon from '../icon/Icon.svelte';
  import { SvelteUiBox } from '$lib/svelte.ui.box.js';

  export let test: string | undefined = undefined;
  export let param: IconButtonParam;
  export let stop: boolean = false;
  export let dispatch = createEventDispatcher<{ click: ButtonModel; toggle: ButtonModel }>();

  const ctx = SvelteUiBox.load(getContext);
  const model = ButtonModel.createIconButton(param);
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

  const clicked = (e: Event) => {
    if (stop) {
      e.stopPropagation();
    }
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
</script>

<button
  on:click={clicked}
  use:assignTestId
  class={$model.resolveClassName()}
  class:has-icon={$model.hasIcon()}
  disabled={$model.disabled}
  style={ctx.resolveButton(model)}
  ><span class="inner"
    ><Icon param={$model.iconParam} on:model={(e) => model.setIconModel(e.detail)} /></span
  ></button
>

<style lang="scss">
  button {
    position: relative;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    border: none;
    border: none;
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
      font-size: var(--svelteuibox-icon-size-xs);
      padding: var(--svelteuibox-icon-padding-xs);
      &.has-icon {
        > .inner {
          column-gap: 4px;
        }
      }
    }
    &.sm {
      font-size: var(--svelteuibox-icon-size-sm);
      padding: var(--svelteuibox-icon-padding-sm);
      &.has-icon {
        > .inner {
          column-gap: 6px;
        }
      }
    }
    &.md {
      font-size: var(--svelteuibox-icon-size-md);
      padding: var(--svelteuibox-icon-padding-md);
      &.has-icon {
        > .inner {
          column-gap: 8px;
        }
      }
    }
    > .inner {
      display: flex;
    }
  }
</style>
