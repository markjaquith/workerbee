import PathRouter from './PathRouter';
import type { Params } from './Router';

function makeGet(path: string): Request {
	return new Request(`https://example.com${path}`);
}

function expectNoRoute(router: PathRouter, path: string) {
	expect(router.matches(makeGet(path))).toBe(false);
	expect(router.getRoute(makeGet(path))).toBeNull();
}

function expectRoute(router: PathRouter, path: string, params: Params = {}) {
	expect(router.matches(makeGet(path))).toBe(true);
	expect(router.getRoute(makeGet(path)).params).toEqual(params);
}

describe('PathRouter', () => {
	test('/', () => {
		const router = new PathRouter('/');
		expectRoute(router, '/');
		expectNoRoute(router, '/foo');
	});

	test('/posts', () => {
		const router = new PathRouter('/posts');
		expectRoute(router, '/posts');
		expectNoRoute(router, '/foo');
		expectNoRoute(router, '/');
	});

	test('/posts/:id', () => {
		const router = new PathRouter('/posts/:id');
		expectRoute(router, '/posts/123', { id: '123' });
		expectRoute(router, '/posts/anything', { id: 'anything' });
		expectNoRoute(router, '/foo');
		expectNoRoute(router, '/');
		expectNoRoute(router, '/posts');
	});

	test('/optional/:id?', () => {
		const router = new PathRouter('/optional/:id?');
		expectRoute(router, '/optional/123', { id: '123' });
		expectRoute(router, '/optional/anything', { id: 'anything' });
		expectRoute(router, '/optional');
		expectNoRoute(router, '/foo');
		expectNoRoute(router, '/');
	});

	test('/wildcard/:extra*', () => {
		const router = new PathRouter('/wildcard/:extra*');
		expectRoute(router, '/wildcard/with/more/stuff', {
			extra: ['with', 'more', 'stuff'],
		});
		expectRoute(router, '/wildcard');
		expectNoRoute(router, '/foo');
		expectNoRoute(router, '/');
	});

	test('/bread/:meat+/bread', () => {
		const router = new PathRouter('/bread/:meat+/bread');
		expectRoute(router, '/bread/peanut-butter/jelly/bread', {
			meat: ['peanut-butter', 'jelly'],
		});
		expectRoute(router, '/bread/ham/bread', { meat: ['ham'] });
		expectNoRoute(router, '/bread/bread');
	});

	test('/mother{-:type}?', () => {
		const router = new PathRouter('/mother{-:type}?');
		expectRoute(router, '/mother-in-law', { type: 'in-law' });
		expectNoRoute(router, '/mothers');
	});
});
