import BaseRouter from './BaseRouter';

const ALL = 'ALL';

export default class MethodRouter extends BaseRouter {
	private method: string;

	constructor(method: string) {
		super();
		this.method = method.toUpperCase();
	}

	matches(request: Request): boolean {
		return this.method === ALL || request.method.toUpperCase() === this.method;
	}
}
