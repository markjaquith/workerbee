import { HandlerProcessor } from '../RequestManager';
import { setRequestUrl } from '../utils';

type Stringable = {
	toString(): string;
};

export default function setUrl(url: Stringable) {
	return async ({ request }: HandlerProcessor) => {
		return setRequestUrl(url.toString(), request);
	};
}
