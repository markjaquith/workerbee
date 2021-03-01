import { makeComplete } from '../utils';

/**
 * Takes a condition (a function which receives a Request or a Response and returns a boolean)
 * and returns a function that immediately adds the handlers if the condition is true
 * when applied to the Request object.
 */
export default function (condition, ...handlers) {
	return async (manager) => {
		if (makeComplete(condition)(manager)) {
			for (const handler of handlers) {
				manager[
					manager.phase === 'request'
						? 'addRequestHandler'
						: 'addResponseHandler'
				](handler, { immediate: true });
			}
		}
	};
}
