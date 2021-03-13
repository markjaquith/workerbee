import BaseRouter from './BaseRouter';
import { match } from 'path-to-regexp';

export default class PathRouter extends BaseRouter {
	private pathPattern: string;

	constructor(pathPattern: string) {
		super();
		this.pathPattern = pathPattern;
	}

	matches(request: Request) {
		return Boolean(match(this.pathPattern)(new URL(request.url).pathname));
	}
}
