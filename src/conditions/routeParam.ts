import { matchesValue } from '../utils';

export default function (param, matcher, { params }) {
	const paramValue = params[param] || false;

	return paramValue && matchesValue(matcher, paramValue);
}
