import Router from './Router';

const makeHandler = () => ({ request: [Symbol()], response: [Symbol()] });

const ROOT_HANDLER = makeHandler();
const POSTS_HANDLER = makeHandler();
const POST_HANDLER = makeHandler();
const POST_UPDATE_HANDLER = makeHandler();
const OPTIONAL_PARAM_HANDLER = makeHandler();
const WILDCARD_HANDLER = makeHandler();
const SANDWICH_HANDLER = makeHandler();
const MOTHER_HANDLER = makeHandler();
const VARIADIC_REQUEST_HANDLERS = [Symbol(), Symbol(), Symbol()];
const MJ_POSTS_HANDLER = makeHandler();
const WILDCARD_FOO_POSTS_HANDLER = makeHandler();

const DOMAIN = 'https://example.com';
const GET = 'GET';
const POST = 'POST';
const ID_PARAM = { id: '123' };
const router = new Router();
router.host('markjaquith.com', (router) => {
	router.get('/posts', MJ_POSTS_HANDLER);
});
router.host('*foo.com', (router) => {
	router.get('/posts', WILDCARD_FOO_POSTS_HANDLER);
});
router.get('/', ROOT_HANDLER);
router.get('/posts', POSTS_HANDLER);
router.get('/posts/:id', POST_HANDLER);
router.post('/posts/:id(\\d+)', POST_UPDATE_HANDLER);
router.get('/optional/:id?', OPTIONAL_PARAM_HANDLER);
router.get('/wildcard/:extra*', WILDCARD_HANDLER);
router.get('/bread/:meat+/bread', SANDWICH_HANDLER);
router.get('/mother{-:type}?', MOTHER_HANDLER);
router.get('/variadic-request-handlers', ...VARIADIC_REQUEST_HANDLERS);

function makeGet(path) {
	return makeGetWithDomain(DOMAIN, path);
}

function makeGetWithDomain(domain: string, path: string) {
	return new Request(domain + path, { method: GET });
}

function makePost(path) {
	return new Request(DOMAIN + path, { method: POST });
}

function makeHandlerMatcher(method, handlers, params = {}) {
	return { method, handlers, params };
}

describe('Router', () => {
	test('makeGet() returns the pathname we pass in', () => {
		expect(new URL(makeGet('/').url).pathname).toBe('/');
	});

	test('always matches', () => {
		expect(router.matches(makeGet('/awoefiajwefoij'))).toBe(true);
	});

	test('GET /', () => {
		expect(router.getRoute(makeGet('/'))).toMatchObject(
			makeHandlerMatcher(GET, ROOT_HANDLER),
		);
	});

	test('GET /posts', () => {
		expect(router.getRoute(makeGet('/posts'))).toMatchObject(
			makeHandlerMatcher(GET, POSTS_HANDLER),
		);
	});

	test('GET /posts/123', () => {
		expect(router.getRoute(makeGet('/posts/123'))).toMatchObject(
			makeHandlerMatcher(GET, POST_HANDLER, ID_PARAM),
		);
	});

	test('POST /posts/123', () => {
		expect(router.getRoute(makePost('/posts/123'))).toMatchObject(
			makeHandlerMatcher(POST, POST_UPDATE_HANDLER, ID_PARAM),
		);
	});

	test('GET /optional/123', () => {
		expect(router.getRoute(makeGet('/optional/123'))).toMatchObject(
			makeHandlerMatcher(GET, OPTIONAL_PARAM_HANDLER, ID_PARAM),
		);
	});

	test('GET /optional', () => {
		expect(router.getRoute(makeGet('/optional'))).toMatchObject(
			makeHandlerMatcher(GET, OPTIONAL_PARAM_HANDLER),
		);
	});

	test('GET /wildcard/with/more-stuff', () => {
		expect(router.getRoute(makeGet('/wildcard/with/more/stuff'))).toMatchObject(
			makeHandlerMatcher(GET, WILDCARD_HANDLER, {
				extra: ['with', 'more', 'stuff'],
			}),
		);
	});

	test('GET /wildcard', () => {
		expect(router.getRoute(makeGet('/wildcard'))).toMatchObject(
			makeHandlerMatcher(GET, WILDCARD_HANDLER, {}),
		);
	});

	test('GET /bread/peanut-butter/jelly/bread', () => {
		expect(
			router.getRoute(makeGet('/bread/peanut-butter/jelly/bread')),
		).toMatchObject(
			makeHandlerMatcher(GET, SANDWICH_HANDLER, {
				meat: ['peanut-butter', 'jelly'],
			}),
		);
	});

	test('GET /bread/ham/bread', () => {
		expect(router.getRoute(makeGet('/bread/ham/bread'))).toMatchObject(
			makeHandlerMatcher(GET, SANDWICH_HANDLER, { meat: ['ham'] }),
		);
	});

	test('GET /bread/bread', () => {
		expect(router.getRoute(makeGet('/bread/bread'))).toBeNull();
	});

	test('GET /mother', () => {
		expect(router.getRoute(makeGet('/mother'))).toMatchObject(
			makeHandlerMatcher(GET, MOTHER_HANDLER),
		);
	});

	test('GET /mother-in-law', () => {
		expect(router.getRoute(makeGet('/mother-in-law'))).toMatchObject(
			makeHandlerMatcher(GET, MOTHER_HANDLER, { type: 'in-law' }),
		);
	});

	test('GET /mothers', () => {
		expect(router.getRoute(makeGet('/mothers'))).toBeNull();
	});

	test('GET /variadic-request-handlers', () => {
		expect(
			router.getRoute(makeGet('/variadic-request-handlers')),
		).toMatchObject(
			makeHandlerMatcher(GET, { request: VARIADIC_REQUEST_HANDLERS }),
		);
	});

	test('GET https://markjaquith.com/posts', () => {
		expect(
			router.getRoute(makeGetWithDomain('https://markjaquith.com', '/posts')),
		).toMatchObject(makeHandlerMatcher(GET, MJ_POSTS_HANDLER));
	});

	test('GET https://anything.foo.com/posts', () => {
		expect(
			router.getRoute(makeGetWithDomain('https://anything.foo.com', '/posts')),
		).toMatchObject(makeHandlerMatcher(GET, WILDCARD_FOO_POSTS_HANDLER));
	});
});
