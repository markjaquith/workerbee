import { ManagerData } from '../RequestManager';
import setUrl from './setUrl';

export default function (path: string) {
	return async function (manager: ManagerData) {
		const url = new URL(manager.request.url);
		url.pathname = path;

		return setUrl(url)(manager);
	};
}
