import applyHandlersIf from './applyHandlersIf';
import applyHandlersUnless from './applyHandlersUnless';
import partial from 'lodash.partial';

export const createIf = fn => (...args) => partial(applyHandlersIf, fn(...args));
export const createUnless = fn => (...args) => partial(applyHandlersUnless, fn(...args));
export default fn => [createIf(fn), createUnless(fn)];
