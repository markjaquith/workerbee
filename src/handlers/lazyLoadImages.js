import AttributeSetter from '../rewriters/AttributeSetter.js';
import isHtml from '../conditions/isHtml.js';

export default async function ({ response }) {
	if (isHtml(response)) {
		return new HTMLRewriter()
			.on('img', new AttributeSetter('loading', 'lazy'))
			.transform(response);
	}
}
