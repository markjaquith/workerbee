import { ManagerData } from '../RequestManager'

export default () => ({ request: { url } }: ManagerData) => {
	return new URL(url).protocol === 'http:'
}
