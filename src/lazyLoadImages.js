import AttributeSetter from './rewriters/AttributeSetter';

export default async function ({ response }) {
	return new HTMLRewriter()
		.on('img', new AttributeSetter('loading', 'lazy'))
		.transform(response);
}
