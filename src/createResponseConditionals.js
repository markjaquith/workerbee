import applyHandlersIf from './applyHandlersIf';
import applyHandlersUnless from './applyHandlersUnless';
import partial from 'lodash/partial';
import withResponse from './withResponse';

export const createIf = (fn) => (...args) => (_manager) =>
	partial(applyHandlersIf, withResponse(fn)(...args));
export const createUnless = (fn) => (...args) => (_manager) =>
	partial(applyHandlersUnless, withResponse(fn)(...args));
export default (fn) => [createIf(fn), createUnless(fn)];
