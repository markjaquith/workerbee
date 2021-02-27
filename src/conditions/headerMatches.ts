import curry from 'lodash/curry';
import { matchesValue } from '../utils';

export default curry(function (headerName, matcher, { headers }) {
	const header = headers.get(headerName) || false;

	return header && matchesValue(matcher, header);
});
