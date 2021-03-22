import { HandlerProcessor } from '../RequestManager';
import setUrl from './setUrl';

export default function prependPath(path: string) {
	return async (processor: HandlerProcessor) => {
		const url = new URL(processor.request.url);
		url.pathname = path + url.pathname;

		return setUrl(url)(processor);
	};
}
