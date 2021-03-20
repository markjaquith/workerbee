import { HandlerProcessor } from '../RequestManager';
import setUrl from './setUrl';

export default (protocol: string) => async ({ request }: HandlerProcessor) => {
	const url = new URL(request.url);
	url.protocol = protocol;

	return setUrl(url)({ request });
};
