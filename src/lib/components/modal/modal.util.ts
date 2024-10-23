import { modalContext, type ModalAction } from './modal.context.js';
import ConfirmModal from './ConfirmModal.svelte';

export const DEFAULT_ACTIONS: ModalAction[] = [
  { text: 'Ok', event: 'ok' },
  { text: 'Cancel', event: 'cancel' }
];

export class ConfirmModalSpec {
  title: string;
  _message: string;
  actions: ModalAction[];
  constructor(
    title: string,
    message: string,
    actions: ModalAction[],
    readonly actionHandler: (value: string, action?: ModalAction) => void
  ) {
    this.title = title;
    this._message = message;
    this.actions = actions;
  }
  get message() {
    return this._message;
  }
}

export type ConfirModal = {
  title?: string;
  message: string;
  actionSpecs?: ModalAction[];
  onActionClick?: (value: string, action?: ModalAction) => void;
};

export const createConfirmModal = ({ title, message, actionSpecs, onActionClick }: ConfirModal) => {
  const actions = actionSpecs
    ? actionSpecs.map((spec) => Object.assign({}, spec))
    : DEFAULT_ACTIONS;
  return new ConfirmModalSpec(title || 'Title', message, actions, onActionClick || (() => {}));
};
const startConfirmModal = (modalSpec: ConfirmModalSpec) => {
  return modalContext.startModal({
    component: ConfirmModal,
    args: { modalSpec },
    mode: 'RESET'
  });
};

export default {
  createConfirmModal,
  startConfirmModal
};
