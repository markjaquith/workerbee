import { ManagerData } from '../RequestManager'
import setUrl from './setUrl'

export default function prependPath(path: string) {
	return async (processor: ManagerData) => {
		const url = new URL(processor.request.url)
		url.pathname = path + url.pathname

		return setUrl(url)(processor)
	}
}
