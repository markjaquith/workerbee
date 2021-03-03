import { curry } from '../utils';
import setUrl from './setUrl';

export default curry(async (protocol: string, { request }) => {
	const url = new URL(request.url);
	url.protocol = protocol + ':';

	return setUrl(url)({ request });
});
