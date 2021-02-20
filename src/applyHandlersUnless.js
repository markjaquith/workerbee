import applyHandlersIf from './applyHandlersIf';
import negate from 'lodash/negate';
import partial from 'lodash/partial';

export default (condition, ...args) =>
	partial(applyHandlersIf, negate(condition))(...args);
