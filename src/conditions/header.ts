import { matchesValue } from '../utils';
import type { ValueMatcher } from '../utils';

export default function (headerName, matcher: ValueMatcher, { headers }) {
	const header = headers.get(headerName) || false;

	return header && matchesValue(matcher, header);
}
