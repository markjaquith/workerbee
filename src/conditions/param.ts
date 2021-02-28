import curry from 'lodash/curry';
import { matchesValue } from '../utils';

export default curry(function (param, matcher, { current }) {
	const url = new URL(current.url);
	const params = url.searchParams;
	const paramValue = params.get(param) || false;

	return paramValue && matchesValue(matcher, paramValue);
});
