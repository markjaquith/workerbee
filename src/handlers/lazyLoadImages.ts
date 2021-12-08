import TimidAttributeSetter from '../rewriters/TimidAttributeSetter'
import isHtml from '../conditions/isHtml'
import { ManagerData } from '../RequestManager'

export default () =>
	async function ({ response }: ManagerData) {
		if (isHtml()(response)) {
			return new HTMLRewriter()
				.on('img', new TimidAttributeSetter('loading', 'lazy'))
				.transform(response)
		}
	}
