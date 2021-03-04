import { setRequestUrl } from '../utils';

type Stringable = {
	toString(): string;
};

export default function setUrl(url: string | Stringable) {
	url = typeof url.toString === 'function' ? url.toString() : url;

	return async ({ request }) => {
		return setRequestUrl(url, request);
	};
}
