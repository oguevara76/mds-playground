import type { FormInputDemoState } from './form-catalog.config';

export function inputDemoWrapClass(state: FormInputDemoState): string {
  if (state === 'hover') {
    return 'p-input-demo-wrap p-input-demo--hover';
  }
  if (state === 'focus') {
    return 'p-input-demo-wrap p-input-demo--focus';
  }
  return '';
}
