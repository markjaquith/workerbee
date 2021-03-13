import PathRouter from './PathRouter';

function makeGet(path: string): Request {
	return new Request(`https://example.com${path}`);
}

describe('PathRouter', () => {
	const DOMAIN = 'https://example.com';
	const GET = 'GET';
	const POST = 'POST';
	const ID_PARAM = { id: '123' };
	// const router = new Router();
	// router.get('/', ROOT_HANDLER);
	// router.get('/posts', POSTS_HANDLER);
	// router.get('/posts/:id', POST_HANDLER);
	// router.get('/optional/:id?', OPTIONAL_PARAM_HANDLER);
	// router.get('/wildcard/:extra*', WILDCARD_HANDLER);
	// router.get('/bread/:meat+/bread', SANDWICH_HANDLER);
	// router.get('/mother{-:type}?', MOTHER_HANDLER);
	// router.get('/variadic-request-handlers', ...VARIADIC_REQUEST_HANDLERS);

	test('/', () => {
		const router = new PathRouter('/');
		expect(router.matches(makeGet('/'))).toBe(true);
		expect(router.matches(makeGet('/foo'))).toBe(false);
	});

	test('/posts', () => {
		const router = new PathRouter('/posts');
		expect(router.matches(makeGet('/posts'))).toBe(true);
		expect(router.matches(makeGet('/foo'))).toBe(false);
		expect(router.matches(makeGet('/'))).toBe(false);
	});

	test('/posts/:id', () => {
		const router = new PathRouter('/posts/:id');
		expect(router.matches(makeGet('/posts/123'))).toBe(true);
		expect(router.matches(makeGet('/foo'))).toBe(false);
		expect(router.matches(makeGet('/'))).toBe(false);
		expect(router.matches(makeGet('/posts/anything'))).toBe(true);
		expect(router.matches(makeGet('/posts'))).toBe(false);
	});

	test('/optional/:id?', () => {
		const router = new PathRouter('/optional/:id?');
		expect(router.matches(makeGet('/optional/123'))).toBe(true);
		expect(router.matches(makeGet('/foo'))).toBe(false);
		expect(router.matches(makeGet('/'))).toBe(false);
		expect(router.matches(makeGet('/optional/anything'))).toBe(true);
		expect(router.matches(makeGet('/optional'))).toBe(true);
	});

	test('/wildcard/:extra*', () => {
		const router = new PathRouter('/wildcard/:extra*');
		expect(router.matches(makeGet('/wildcard/with/more/stuff'))).toBe(true);
		expect(router.matches(makeGet('/wildcard'))).toBe(true);
	});

	test('/bread/:meat+/bread', () => {
		const router = new PathRouter('/bread/:meat+/bread');
		expect(router.matches(makeGet('/bread/peanut-butter/jelly/bread'))).toBe(
			true,
		);
		expect(router.matches(makeGet('/bread/ham/bread'))).toBe(true);
		expect(router.matches(makeGet('/bread/bread'))).toBe(false);
	});

	test('/mother{-:type}?', () => {
		const router = new PathRouter('/mother{-:type}?');
		expect(router.matches(makeGet('/mother-in-law'))).toBe(true);
		expect(router.matches(makeGet('/mothers'))).toBe(false);
	});
});
