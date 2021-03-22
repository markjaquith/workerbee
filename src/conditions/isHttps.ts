import { HandlerProcessor } from '../RequestManager';

export default () => ({ request: { url } }: HandlerProcessor) => {
	return new URL(url).protocol === 'https:';
};
