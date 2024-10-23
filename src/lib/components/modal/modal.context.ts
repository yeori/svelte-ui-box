import {
  type ComponentType,
  SvelteComponent,
  type ComponentProps,
  type EventDispatcher
} from 'svelte';
import { writable, get, type Writable, type Subscriber } from 'svelte/store';
import modalUtil from './modal.util.js';
import { SvelteStore } from '$lib/store/index.js';
import { UIHelper } from '$lib/helper.js';

export interface ModalAction {
  icon?: string;
  text?: string;
  event: string;
  disabled?: boolean;
}
export interface ModalActionConfig {
  align: 'left' | 'right';
  buttons: ModalAction[];
}
export interface FullscreenShape {
  margin: string;
}
export interface ModalShapeParam {
  fullscreen?: boolean | FullscreenShape;
  width?: 'sm' | 'md' | 'lg' | 'fluid';
  height?: 'auto' | string;
  padding?: string;
  backdrop?: boolean;
  actions?: ModalAction[];
  closable?: boolean;
  shadow?: boolean;
  zIndex?: number;
}
export class ModalShape implements ModalShapeParam {
  fullscreen: boolean | FullscreenShape = false;
  width: 'sm' | 'md' | 'lg' | 'fluid' = 'sm';
  height: 'auto' | string = 'auto';
  padding: string = '8px';
  backdrop: boolean = true;
  actions: ModalAction[] | undefined;
  closable: boolean = true;
  shadow: boolean = false;
  zIndex: number = 500;
  constructor(shape: ModalShapeParam) {
    UIHelper.keys(shape)
      .filter((prop) => shape[prop] !== undefined)
      .forEach((prop) => {
        (this[prop] as ModalShapeParam[keyof ModalShapeParam]) = shape[prop];
      });
  }
}
export class EventOption {
  [eventName: string]: (args: unknown) => boolean | void;
}
const DEFAULT_MODAL_OPTION = new ModalShape({
  fullscreen: false,
  padding: '8px',
  width: 'sm',
  backdrop: true,
  actions: undefined,
  closable: true,
  shadow: false
});
export type ModalOpenMode = 'NAV' | 'RESET' | 'POPOVER';

export class ModalOption {
  shape: ModalShape;
  component: ComponentType<SvelteComponent>;
  args: ComponentProps<SvelteComponent>;
  callbacks: { [event: string]: () => void };
  mode: ModalOpenMode;
  dispatch?: EventDispatcher<Record<string, unknown>>; // (eventName: string, detail: any) => boolean | void
  constructor(
    readonly headerOption: ModalHeaderConfig,
    shape: ModalShape | undefined,
    component: ComponentType<SvelteComponent>,
    args: ComponentProps<SvelteComponent>
  ) {
    this.shape = Object.assign({}, DEFAULT_MODAL_OPTION, shape);
    this.component = component;
    this.args = args;
    this.callbacks = {};
    this.mode = 'RESET';
  }
  get backdrop() {
    return this.shape.backdrop;
  }
  get headerVisible() {
    return this.headerOption.visible;
  }
  get title() {
    return this.headerOption.title;
  }
  get headerActions() {
    return this.headerOption.actions;
  }
  get actions() {
    return this.shape.actions;
  }
  get closable() {
    return this.shape.closable;
  }
  get closeIcon() {
    return 'arrow_back.svg';
  }
  get width() {
    return this.shape.width;
  }
  get padding() {
    return this.shape.padding;
  }
  get fullscreen() {
    return this.shape.fullscreen;
  }
  get shadow() {
    return this.shape.shadow;
  }
  get height() {
    return this.shape.height || '100%';
  }
  get zIndex() {
    return '' + this.shape.zIndex;
  }
  getActions() {
    return this.shape.actions;
  }
  on(eventName: string, callback: () => void) {
    this.callbacks[eventName] = callback;
    return this;
  }
}
export class ModalHeaderConfig {
  title: string = 'Title';
  actions: ModalAction[] = [];
  visible: boolean = true;
  constructor(args: ModalHeaderConfig) {
    UIHelper.keys(args).map((prop) => {
      if (args[prop] !== undefined) {
        (this[prop] as ModalHeaderConfig[keyof ModalHeaderConfig]) = args[prop];
      }
    });
  }
}
export type ModalParams = {
  title?: string | ModalHeaderConfig;
  shape?: ModalShapeParam;
  component: ComponentType<SvelteComponent>;
  args?: ComponentProps<SvelteComponent>;
  mode?: ModalOpenMode;
  events?: EventOption;
};
export class ModalGroup {
  options: ModalOption[];
  activeIndex: number;
  constructor(option: ModalOption) {
    this.options = [option];
    this.activeIndex = 0;
  }
  push(option: ModalOption) {
    this.options.push(option);
    this.activeIndex = this.options.length - 1;
  }
  pop() {
    if (this.options.length > 0) {
      this.activeIndex -= 1;
      return this.options.pop();
    }
    return undefined;
  }
  isEmpty() {
    return this.options.length === 0;
  }
  getActiveOption() {
    return this.options[this.activeIndex];
  }
}
export class ModalContext extends SvelteStore<ModalContext> {
  protected readonly store: Writable<ModalContext>;
  actives: ModalOption[];
  constructor(readonly groups: ModalGroup[]) {
    super();
    this.store = writable(this);
    this.actives = [];
  }
  get length() {
    return this.groups.length;
  }
  get activeOptions() {
    this.actives = get(this.store).groups.map((group) => group.getActiveOption());
    return this.actives;
    // const lastIdx = this.length - 1
    // return lastIdx >= 0 ? this.groups[lastIdx] : undefined
  }
  subscribe(callback: Subscriber<ModalContext>) {
    return this.store.subscribe(callback);
  }
  push(option: ModalOption) {
    this.store.update((store) => {
      let group = this.getLastGroup();
      if (!group) {
        group = new ModalGroup(option);
      }
      group.push(option);
      return store;
    });
  }
  getLastGroup() {
    return this.groups[this.groups.length - 1];
  }
  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    const currentGroup = this.groups ? this.groups[this.groups.length - 1] : undefined;

    let popedMdal: ModalOption | undefined;
    if (currentGroup) {
      popedMdal = currentGroup.pop();
      this.groups.pop();
      this.update();
    }
    return popedMdal;
  }
  moveBack() {
    return this.pop();
  }
  reset(option: ModalOption) {
    this.groups.splice(0, this.length, new ModalGroup(option));
    this.update();
  }
  poppover(option: ModalOption) {
    const group = new ModalGroup(option);
    this.groups.push(group);
    this.update();
  }
  isEmpty() {
    return this.length === 0;
  }
  clear() {
    return new Promise<void>((resolve) => {
      this.groups.splice(0, this.length);
      this.update();
      resolve();
    });
  }
  startModal({ title, shape, component, args, events, mode = 'RESET' }: ModalParams) {
    const options = this.activeOptions;
    const prevModal = options ? options[options.length - 1] : undefined;
    const option = buildModalOption(
      title || 'Title',
      shape,
      component,
      args,
      events,
      mode,
      prevModal
    );
    if (mode === 'RESET') {
      this.reset(option);
    } else if (mode === 'NAV') {
      this.push(option);
    } else if (mode === 'POPOVER') {
      this.poppover(option);
    }
    return option;
  }
}

const modalContext = new ModalContext([]);

const parseHeader = (header: string | ModalHeaderConfig): ModalHeaderConfig => {
  const option = new ModalHeaderConfig({
    title: '',
    actions: [],
    visible: true
  });
  if (!header) {
    option.visible = false;
  } else if (typeof header === 'string') {
    option.title = header;
  } else {
    option.title = header.title;
    option.actions = header.actions;
  }
  return option;
};
const resolveModalArgs = (
  args: ModalShapeParam | undefined,
  mode: ModalOpenMode,
  prevModal: ModalOption | undefined
) => {
  if (args) {
    return new ModalShape(args);
  }
  if (mode === 'RESET') {
    return DEFAULT_MODAL_OPTION;
  } else {
    // nav, popup 등은 현재 열린 창의 shape을 같이 사용함
    return prevModal?.shape || DEFAULT_MODAL_OPTION;
  }
};
const buildModalOption = (
  header: string | ModalHeaderConfig,
  shapeParam: ModalShapeParam | undefined,
  component: ComponentType<SvelteComponent>,
  args: ComponentProps<SvelteComponent>,
  events: EventOption | undefined,
  mode: ModalOpenMode,
  prevModal: ModalOption | undefined
) => {
  const headerOption = parseHeader(header);
  const shape = resolveModalArgs(shapeParam, mode, prevModal);
  mode = mode || 'NAV';

  const option = new ModalOption(headerOption, shape, component, args || {});
  option.mode = mode;

  if (events) {
    /**
     *
     * @param eventName
     * @param value
     */
    const dispatch = (eventName: string, detail: unknown) => {
      const callback = events[eventName];
      if (callback) {
        const event = new CustomEvent(eventName, { detail });
        const close = callback(event);
        if (close) {
          modalContext.clear();
        }
      }
      return true;
    };
    option.args.dispatch = option.dispatch = dispatch;
  }

  return option;
};
export { modalContext, modalUtil };
