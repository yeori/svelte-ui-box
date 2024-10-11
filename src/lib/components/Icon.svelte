<script lang="ts">
  import { UIHelper } from '$lib/helper.js';
  /**
   * icon - path of icon
   */
  export let icon: string | undefined = undefined;
  export let type: 'mask' | 'manual' = 'mask';
  export let size: 'xs' | 'sm' | 'md' = 'sm';
  export let xsSize = '1rem';
  export let smSize = '1.25rem';
  export let mdSize = '1.50rem';
  export let active = false;
  /**
   * secify the icon sizes using array format. It has 3 value [string, number, number]
   *  - sizeRatio[0] is the size of xs icon like '1rem', '12px' etc.
   *  - sizeRatio[1] and sizeRatio[2] are proportions to `sizeRatio[0]` like `1.24`
   *
   * example
   *```svelte
   * <script>
   *  const iconRatio = ['0.9rem', 1.2, 1.4]
   * </scipt>
   *
   * <Icon ratio={iconRatio} size="xs" icon='/images/hover.svg'>
   * <Icon ratio={iconRatio} size="sm" icon='/images/close.svg'>
   * <Icon ratio={iconRatio} size="md" icon='/images/brand.svg'>
   *
   * * `hover.svg' is 0.9rem
   * * `close.svg` is 1.08rem
   * * `brand.svg` is 1.26rem
   * ```
   *
   * @default undefined
   *
   */
  export let ratio: [string, number, number] | undefined = undefined;
  /**
   * icon color.
   * If type is `mask`, it is background color for masking effect.
   * If type is `manual`, is is not used.
   */
  export let color: string | undefined = undefined;
  export let flip = false;
  export let spin: boolean = false;
  export let rotate: number = 0;
  export { clazz as class };
  let clazz = '';
  const mergeIconSize = (style: Record<string, string>) => {
    let xs = xsSize;
    let sm = smSize;
    let md = mdSize;
    if (ratio) {
      xs = ratio[0];
      const [base, unit] = UIHelper.parseSizeUnit(xs);
      sm = `${base * ratio[1]}${unit}`;
      md = `${base * ratio[2]}${unit}`;
    }
    style['icon-xs-size'] = xs;
    style['icon-sm-size'] = sm;
    style['icon-md-size'] = md;
  };
  const resolveManualStyle = () => {
    const style: Record<string, string> = {
      'icon-rotate': `${rotate}deg`,
      'icon-path': `url(${icon || 'empty'})`,
      'background-color': color || '#777'
    };
    mergeIconSize(style);
    return UIHelper.resolveStyles(style, 'box');
  };
</script>

<span
  class="icon {type} {size} {clazz}"
  class:flip={rotate && flip}
  class:spin
  class:active
  class:empty={!icon}
  style={type === 'mask' ? resolveManualStyle() : ''}
  >{#if type === 'manual'}{icon || ''}{/if}</span
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
