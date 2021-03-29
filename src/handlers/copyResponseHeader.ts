import { ManagerData } from '../RequestManager';
import { delayUntilResponsePhase } from '../utils';

export default function copyResponseHeader(from: string, to: string) {
	const handler = async function ({ response }: ManagerData) {
		const { headers } = response;

		if (headers.has(from)) {
			const fromValue = headers.get(from);
			if (fromValue && fromValue.length) {
				const newResponse = new Response(response.body, response);
				newResponse.headers.set(to, fromValue);
				return newResponse;
			}
		}
	};

	return delayUntilResponsePhase(handler);
}
