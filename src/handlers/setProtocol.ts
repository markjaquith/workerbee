import { HandlerProcessor } from '../RequestManager';
import setUrl from './setUrl';

export default (protocol: string) => async (processor: HandlerProcessor) => {
	const url = new URL(processor.request.url);
	url.protocol = protocol;

	return setUrl(url)(processor);
};
