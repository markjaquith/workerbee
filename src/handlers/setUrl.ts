import { setRequestUrl } from '../utils';

type Stringable = {
	toString(): string;
};

export default function setUrl(url: Stringable) {
	return async ({ request }) => {
		return setRequestUrl(url.toString(), request);
	};
}
