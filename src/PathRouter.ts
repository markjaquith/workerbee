import BaseRouter from './BaseRouter';
import { match } from 'path-to-regexp';
import { Params } from './Router';

export default class PathRouter extends BaseRouter {
	private pathPattern: string;

	constructor(pathPattern: string) {
		super();
		this.pathPattern = pathPattern;
	}

	matches(request: Request) {
		return Boolean(match(this.pathPattern)(new URL(request.url).pathname));
	}

	getRoute(request: Request) {
		const result = match(this.pathPattern)(new URL(request.url).pathname);
		if (result) {
			return {
				handlers: this.handlers,
				url: request.url,
				method: request.method,
				params: result.params as Params,
			};
		}

		return null;
	}
}
