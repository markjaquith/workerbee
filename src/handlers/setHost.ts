import { HandlerProcessor } from '../RequestManager';
import setUrl from './setUrl';

export default function setHost(newHost: string) {
	return async (processor: HandlerProcessor) => {
		const url = new URL(processor.request.url);
		url.host = newHost;

		return setUrl(url)(processor);
	};
}
