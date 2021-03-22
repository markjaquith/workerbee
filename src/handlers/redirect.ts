import { HandlerProcessor } from '../RequestManager';

export default function redirect(code = 302) {
	return async ({ request }: HandlerProcessor) => {
		return Response.redirect(request.url, code);
	};
}
