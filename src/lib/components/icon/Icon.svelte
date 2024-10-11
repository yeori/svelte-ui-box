<script lang="ts">
  import { UIHelper } from '$lib/helper.js';
  import { getContext } from 'svelte';
  import type { IconModel } from './icon.model.js';
  import { SvelteUiBox } from '$lib/svelte.ui.box.js';
  export let model: IconModel;
  export { clazz as class };
  let clazz = '';

  const ctx = SvelteUiBox.load(getContext);
  ctx.resolveIcon(model);

  const mergeIconSize = (style: Record<string, string>) => {
    const { xsSize, smSize, mdSize } = model;
    let xs = xsSize;
    let sm = smSize;
    let md = mdSize;

    style['icon-xs-size'] = xs;
    style['icon-sm-size'] = sm;
    style['icon-md-size'] = md;
  };
  const resolveMaskStyle = () => {
    const icon = ctx.resolveIconPath(model);
    const { rotate, color, xsSize, smSize, mdSize } = model;
    const style: Record<string, string> = {
      'icon-rotate': `${rotate}deg`,
      'icon-path': `url(${icon || 'empty'})`,
      'background-color': color || '#777',
      'icon-xs-size': xsSize,
      'icon-sm-size': smSize,
      'icon-md-size': mdSize
    };
    mergeIconSize(style);
    return UIHelper.resolveStyles(style, 'box');
  };
</script>

<span
  class="icon {$model.type} {$model.size} {clazz}"
  class:spin={$model.spin}
  class:active={$model.active}
  class:empty={!$model.icon}
  style={$model.type === 'mask' ? resolveMaskStyle() : ''}
  >{#if $model.type === 'manual'}{$model.icon || ''}{/if}</span
>

<style lang="scss">
  .icon {
    display: flex;
    &.flip {
      transform: rotate(180deg);
    }
    &.spin {
      animation: spin-icon 1s linear infinite;
    }
    &.mask {
      mask-image: var(--box-icon-path);
      -webkit-mask-image: var(--box-icon-path);
      background-color: var(--box-background-color);
      background-size: contain;

      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      mask-position: center;
      -webkit-mask-position: center;
      mask-size: cover;
      -webkit-mask-size: cover;
      transform: rotate(var(--box-icon-rotate));
      &.xs {
        width: var(--box-icon-xs-size);
        height: var(--box-icon-xs-size);
      }
      &.sm {
        width: var(--box-icon-sm-size);
        height: var(--box-icon-sm-size);
      }
      &.md {
        width: var(--box-icon-md-size);
        height: var(--box-icon-md-size);
      }
    }
    &.manual {
      user-select: none;
      &.active {
        font-variation-settings: 'FILL' 1;
      }
      &.xs {
        font-size: var(--box-icon-xs-size);
        &.empty {
          width: var(--box-icon-xs-size);
          height: var(--box-icon-xs-size);
        }
      }
      &.sm {
        font-size: var(--box-icon-sm-size);
        &.empty {
          width: var(--box-icon-sm-size);
          height: var(--box-icon-sm-size);
        }
      }
      &.md {
        font-size: var(--box-icon-md-size);
        &.empty {
          width: var(--box-icon-md-size);
          height: var(--box-icon-md-size);
        }
      }
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
