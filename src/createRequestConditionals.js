import applyHandlersIf from './applyHandlersIf';
import applyHandlersUnless from './applyHandlersUnless';
import partial from 'lodash/partial';
import withRequest from './withRequest';

export const createIf = (fn) => (...args) => (_manager) =>
	partial(applyHandlersIf, withRequest(fn)(...args));
export const createUnless = (fn) => (...args) => (_manager) =>
	partial(applyHandlersUnless, withRequest(fn)(...args));
export default (fn) => [createIf(fn), createUnless(fn)];
