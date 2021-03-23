import type { Handler, ManagerData } from '../RequestManager';
import type { Condition } from '../utils';

/**
 * Takes a condition (a function which receives a Request or a Response and returns a boolean)
 * and returns a function that immediately adds the handlers if the condition is true
 * when applied to the Request object.
 */
export default function (condition: Condition, ...handlers: Handler[]) {
	return async (manager: ManagerData) => {
		if (condition(manager)) {
			for (const handler of handlers.reverse()) {
				const adder =
					manager.phase === 'request' && manager.addRequestHandler
						? manager.addRequestHandler
						: manager.addResponseHandler;
				adder(handler, { immediate: true });
			}
		}
	};
}
