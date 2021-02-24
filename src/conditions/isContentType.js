import { toArray } from '../utils';
import curry from 'lodash/curry';

export default curry(function(types, thing) {
	return thing && thing.headers && thing.headers.has('content-type') && toArray(types).includes(thing.headers.get('content-type').split(';')[0].trim());
});
