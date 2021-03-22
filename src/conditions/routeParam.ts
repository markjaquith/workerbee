import { HandlerProcessor } from '../RequestManager';
import { matchesValue, ValueMatcher } from '../utils';

export default function (
	param: string,
	matcher: ValueMatcher,
	{ params }: HandlerProcessor,
) {
	let paramValue = params[param] || false;

	// TODO: handle multiple values.
	if (Array.isArray(paramValue)) {
		paramValue = paramValue[0];
	}

	return paramValue && matchesValue(matcher, paramValue);
}
