import AttributeSetter from '../rewriters/AttributeSetter';
import isHtml from '../conditions/isHtml';
import { incomplete } from '../utils';

export default incomplete(async function ({ response }) {
	if (isHtml()(response)) {
		return new HTMLRewriter()
			.on('img', new AttributeSetter('loading', 'lazy'))
			.transform(response);
	}
});
