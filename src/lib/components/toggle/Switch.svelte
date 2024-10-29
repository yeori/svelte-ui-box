<script lang="ts">
  import { SvelteUiBox } from '$lib/svelte.ui.box.js';
  import { createEventDispatcher, getContext, onMount } from 'svelte';
  import { SwitchModel, type SwitchParam } from './switch.model.js';

  export let param: SwitchParam;
  export let dispatch = createEventDispatcher<{ model: SwitchModel }>();

  const ctx = SvelteUiBox.load(getContext);
  const model = SwitchModel.fromParam(param, ctx);
  onMount(() => {
    dispatch('model', model);
  });
</script>

<span
  ><input type="checkbox" id={model.uuid} bind:checked={$model.checked} /><label
    for={model.uuid}
    style={model.resovleCssVars()}>Toggle</label
  ></span
>

<style lang="scss">
  span {
    display: inline-flex;
    position: relative;
    input[type='checkbox'] {
      height: 0;
      width: 0;
      top: 50%;
      left: 50%;
      position: absolute;
      visibility: hidden;
    }

    label {
      cursor: pointer;
      text-indent: -9999px;
      width: var(--svelteuibox-switch-width, 60px);
      height: var(--svelteuibox-switch-height, 30px);
      background: var(--svelteuibox-color-accent-bgc0);
      display: block;
      border-radius: 100px;
      position: relative;
    }

    label:after {
      content: '';
      position: absolute;
      top: var(--svelteuibox-switch-label-gap, 0px);
      left: var(--svelteuibox-switch-label-gap, 0px);
      width: var(--svelteuibox-switch-label-size, 30px);
      height: var(--svelteuibox-switch-label-size, 30px);
      background: var(--svelteuibox-button-disable-color);
      border-radius: 90px;
      transition: 0.2s;
    }

    input:checked + label {
      background: var(--svelteuibox-color-accent-bgc3);
    }

    input:checked + label:after {
      left: calc(100% - var(--svelteuibox-switch-label-gap, 0px));
      transform: translateX(-100%);
      background: var(--svelteuibox-color-accent-fgc3);
    }
  }
</style>
