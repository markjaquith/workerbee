import curry from 'lodash.curry';
import { toArray } from './utils';

/**
 * Takes condition (a function which receives a RequestManager object and returns a boolean)
 * and an array of handlers (or a single handler) and returns a
 */
export default curry(function applyHandlersIf(condition, handlers) {
	handlers = toArray(handlers);

	return async (manager) => {
		if (condition(manager)) {
			for (const handler of handlers) {
				const addHandler =
					manager.phase === 'response'
						? manager.addImmediateResponseaddHandler
						: manager.addImmediateRequestHandler;
				addHandler(handler);
			}
		}
	};
});
