import { matchesValue } from '../utils';
import type { ValueMatcher } from '../utils';

export default function (matcher: ValueMatcher, message) {
	return (
		message?.headers?.has('content-type') &&
		matchesValue(
			matcher,
			message.headers?.get('content-type').split(';')[0].trim(),
		)
	);
}
