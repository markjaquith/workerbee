import { matchesValue } from '../utils';
import type { ValueMatcher } from '../utils';

export default function (matcher: ValueMatcher, response: Response) {
	return (
		response.headers.has('content-type') &&
		response.headers.get('content-type') &&
		matchesValue(
			matcher,
			response.headers.get('content-type')!.split(';')[0].trim(),
		)
	);
}
