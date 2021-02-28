import { matchesValue } from '../utils';
import type { ValueMatcher } from '../utils';

export default function (param, matcher: ValueMatcher, { url }) {
	url = new URL(url);
	const params = url.searchParams;
	const paramValue = params.get(param) || false;

	return paramValue && matchesValue(matcher, paramValue);
}
