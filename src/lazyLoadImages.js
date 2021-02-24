import AttributeSetter from './rewriters/AttributeSetter';
import isHtml from './conditions/isHtml';

export default async function ({ response }) {
	if (isHtml(response)) {
		return new HTMLRewriter()
			.on('img', new AttributeSetter('loading', 'lazy'))
			.transform(response);
	}
}
