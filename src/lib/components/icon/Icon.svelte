<script lang="ts" strictEvents>
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import { IconModel, type IconParam } from './icon.model.js';
  import { SvelteUiBox } from '$lib/svelte.ui.box.js';
  export let param: IconParam;
  export { clazz as class };
  let clazz = '';
  export let dispatch = createEventDispatcher<{ model: IconModel }>();

  const model = IconModel.create(param);
  const ctx = SvelteUiBox.load(getContext);

  onMount(() => {
    dispatch('model', model);
  });
</script>

<span
  class="icon {$model.type} {$model.getSizeClass()} {clazz}"
  class:spin={$model.spin}
  class:empty={!$model.icon}
  class:round={$model.round}
  style={ctx.resolveIcon($model)}
></span>

<style lang="scss">
  .icon {
    display: inline-flex;
    user-select: none;
    line-height: 1;
    &:before {
      content: '';
      display: inline-block;
    }
    &.flip {
      transform: rotate(180deg);
    }
    &.spin {
      animation: spin-icon 1s linear infinite;
    }
    &.round {
      border-radius: var(--svelteuibox-icon-border-raduis);
    }
    &.xs {
      width: var(--svelteuibox-icon-size-xs, 0.9rem);
      height: var(--svelteuibox-icon-size-xs, 0.9rem);
    }
    &.sm {
      width: var(--svelteuibox-icon-size-sm, 1rem);
      height: var(--svelteuibox-icon-size-sm, 1rem);
    }
    &.md {
      width: var(--svelteuibox-icon-size-dm, 1.25rem);
      height: var(--svelteuibox-icon-size-dm, 1.25rem);
    }
    &.custom {
      width: var(--svelteuibox-icon-custom-size, 1rem);
      height: var(--svelteuibox-icon-custom-size, 1rem);
    }
    &.mask {
      mask-image: var(--svelteuibox-icon-path);
      -webkit-mask-image: var(--svelteuibox-icon-path);
      background-color: var(--svelteuibox-icon-background-color);
      background-size: contain;

      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      mask-position: center;
      -webkit-mask-position: center;
      mask-size: cover;
      -webkit-mask-size: cover;
      transform: rotate(var(--svelteuibox-icon-rotate));
    }
    &.bg {
      background: var(--svelteuibox-icon-path);
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }

  @keyframes spin-icon {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
