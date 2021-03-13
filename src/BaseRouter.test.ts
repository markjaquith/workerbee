import BaseRouter from './BaseRouter';

class MatchesRouter extends BaseRouter {
	matches(_request): true {
		return true;
	}
}

class RouteRouter extends MatchesRouter {
	getRoute(request) {
		return this.getDefaultResponse(request);
	}
}

class FalseRouter extends BaseRouter {
	matches(_request) {
		return false;
	}

	getRoute(_request) {
		return null;
	}
}

const REQUEST = new Request('https://example.com/');

describe('BaseRouter', () => {
	test('RouteRouter returns router', () => {
		const router = new RouteRouter();
		expect(router.matches(REQUEST)).toBe(true);
		expect(router.getRoute(REQUEST)).not.toBeNull();
	});

	test('MatchesRouter returns matches but returns null', () => {
		const router = new MatchesRouter();
		expect(router.matches(REQUEST)).toBe(true);
		expect(router.getRoute(REQUEST)).toBeNull();
	});

	test('FalseRouter does not match and returns null', () => {
		const router = new FalseRouter();
		expect(router.matches(REQUEST)).toBe(false);
		expect(router.getRoute(REQUEST)).toBeNull();
	});

	test('MatchesRouter(FalseRouter) matches but returns null', () => {
		const router = new MatchesRouter();
		router.addRouter(new FalseRouter());
		expect(router.matches(REQUEST)).toBe(true);
		expect(router.getRoute(REQUEST)).toBeNull();
	});

	test('MatchesRouter(MatchesRouter(FalseRouter)) matches but returns null', () => {
		const router = new MatchesRouter();
		const secondLevelRouter = new MatchesRouter();
		secondLevelRouter.addRouter(new FalseRouter());
		router.addRouter(secondLevelRouter);
		expect(router.matches(REQUEST)).toBe(true);
		expect(router.getRoute(REQUEST)).toBeNull();
	});

	test('MatchesRouter(RouteRouter) matches and returns route', () => {
		const router = new MatchesRouter();
		router.addRouter(new RouteRouter());
		expect(router.matches(REQUEST)).toBe(true);
		expect(router.getRoute(REQUEST)).not.toBeNull();
	});

	test('MatchesRouter(FalseRoute, RouteRouter) matches and returns route', () => {
		const router = new MatchesRouter();
		router.addRouter(new FalseRouter());
		router.addRouter(new RouteRouter());
		expect(router.matches(REQUEST)).toBe(true);
		expect(router.getRoute(REQUEST)).not.toBeNull();
	});

	test('MatchesRouter(MatchesRouter(FalseRouter, RouteRouter)) matches and returns route', () => {
		const router = new MatchesRouter();
		const secondLevelRouter = new MatchesRouter();
		secondLevelRouter.addRouter(new FalseRouter());
		secondLevelRouter.addRouter(new RouteRouter());
		router.addRouter(secondLevelRouter);
		expect(router.matches(REQUEST)).toBe(true);
		expect(router.getRoute(REQUEST)).not.toBeNull();
	});
});
