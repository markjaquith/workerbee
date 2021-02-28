import curry from 'lodash/curry';
import { matchesValue } from '../utils';

export default curry(function (param, matcher, { current: { params } }) {
	const paramValue = params[param] || false;

	return paramValue && matchesValue(matcher, paramValue);
});
