import AttributeSetter from '../rewriters/AttributeSetter';
import isHtml from '../conditions/isHtml';
import { ManagerData } from '../RequestManager';

export default () =>
	async function ({ response }: ManagerData) {
		if (isHtml()(response)) {
			return new HTMLRewriter()
				.on('img', new AttributeSetter('loading', 'lazy'))
				.transform(response);
		}
	};
