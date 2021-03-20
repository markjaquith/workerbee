import type { Handler, HandlerProcessor } from '../RequestManager';

/**
 * Takes a condition (a function which receives a Request or a Response and returns a boolean)
 * and returns a function that immediately adds the handlers if the condition is true
 * when applied to the Request object.
 */
type Condition = (...any: any[]) => boolean;

export default function (condition: Condition, ...handlers: Handler[]) {
	return async (manager: HandlerProcessor) => {
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
