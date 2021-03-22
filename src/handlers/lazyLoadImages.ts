import AttributeSetter from '../rewriters/AttributeSetter';
import isHtml from '../conditions/isHtml';
import { HandlerProcessor } from '../RequestManager';

export default () =>
	async function ({ response }: HandlerProcessor) {
		if (isHtml()(response)) {
			return new HTMLRewriter()
				.on('img', new AttributeSetter('loading', 'lazy'))
				.transform(response);
		}
	};
