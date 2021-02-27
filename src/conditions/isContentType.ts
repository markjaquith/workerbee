import { matchesValue } from '../utils';
import curry from 'lodash/curry';
import type { ValueMatcher } from '../utils';

export default curry(function (matcher: ValueMatcher, thing) {
	return (
		thing?.headers?.has('content-type') &&
		matchesValue(matcher, thing.headers?.get('content-type').split(';')[0].trim())
	);
});
