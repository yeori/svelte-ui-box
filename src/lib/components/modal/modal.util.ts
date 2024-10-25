import { modalContext, type ModalAction } from './modal.context.js';
import ConfirmModal from './ConfirmModal.svelte';

export const DEFAULT_ACTIONS: ModalAction[] = [
  { text: 'Ok', event: 'yes' },
  { text: 'Cancel', event: 'no' }
];

export class ConfirmModalSpec {
  constructor(
    readonly title: string | undefined,
    readonly message: string,
    readonly actions: ModalAction[] | undefined,
    readonly actionHandler: (value: string, action?: ModalAction) => void
  ) {}
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
  return new ConfirmModalSpec(title, message, actions, onActionClick || (() => {}));
};
const startConfirmModal = (modalSpec: ConfirmModalSpec) => {
  return modalContext.startModal({
    title: modalSpec.title,
    component: ConfirmModal,
    args: { modalSpec },
    mode: 'RESET'
  });
};

export default {
  createConfirmModal,
  startConfirmModal
};
