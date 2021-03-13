import BaseRouter from './BaseRouter';
import type { RouterInterface, Route } from './BaseRouter';

export default class HostRouter extends BaseRouter implements RouterInterface {
	private hostPattern: string;

	constructor(hostPattern: string) {
		super();
		this.hostPattern = hostPattern;
	}

	matches(request: Request): boolean {
		const url = new URL(request.url);

		// TODO: wildcard matching. For now, strict equality matching only.
		return url.hostname === this.hostPattern;
	}
}
