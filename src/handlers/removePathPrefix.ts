import { HandlerProcessor } from '../RequestManager';
import setUrl from './setUrl';

export default function removePathPrefix(path: string) {
	return async (processor: HandlerProcessor) => {
		const url = new URL(processor.request.url);
		if (url.pathname.startsWith(path)) {
			url.pathname = url.pathname.substring(path.length);
			return setUrl(url)(processor);
		}
	};
}
