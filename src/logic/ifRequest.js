import all from './all';

/**
 * Takes conditions (functions which receive a RequestManager object and return a boolean)
 * and returns a function that immediately adds the handlers if the conditions are all true
 * when applied to the Request object.
 */
export default function (...conditions) {
	return function(...handlers) {	
		return async (manager) => {
			const condition = all(...conditions);

			if (condition(manager)) {
				for (const handler of handlers) {
					manager.addRequestHandler(handler, { immediate: true });
				}
			}
		};
	};
}
