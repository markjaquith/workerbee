import Router from './Router';
import httpMocks from 'node-mocks-http';

const makeHandler = () => ({ request: Symbol(), response: Symbol() });

const ROOT_HANDLER = makeHandler();
const POSTS_HANDLER = makeHandler();
const POST_HANDLER = makeHandler();
const POST_UPDATE_HANDLER = makeHandler();
const OPTIONAL_PARAM_HANDLER = makeHandler();
const WILDCARD_HANDLER = makeHandler();
const SANDWICH_HANDLER = makeHandler();

const DOMAIN = 'https://example.com';
const GET = 'GET';
const POST = 'POST';
const ID_PARAM = { id: '123' };
const router = new Router();
router.get('/', ROOT_HANDLER);
router.get('/posts', POSTS_HANDLER);
router.get('/posts/:id', POST_HANDLER);
router.post('/posts/:id', POST_UPDATE_HANDLER);
router.get('/optional/:id?', OPTIONAL_PARAM_HANDLER);
router.get('/wildcard/:extra*', WILDCARD_HANDLER);
router.get('/bread/:meat*/bread', SANDWICH_HANDLER);

function makeGet(path) {
	return httpMocks.createRequest({
		method: GET, 
		url: DOMAIN + path,
	});
}

function makePost(path) {
	return httpMocks.createRequest({
		method: 'POST',
		url: DOMAIN + path,
	});
}

function makeHandlerMatcher(method, handlers, params = {}) {
	return { method, handlers, params };
}

test('Router', () => {
	expect(makeGet('/').path).toBe('/');
	expect(router.getRoute(makeGet('/'))).toMatchObject(makeHandlerMatcher(GET, ROOT_HANDLER));
	expect(router.getRoute(makeGet('/posts'))).toMatchObject(makeHandlerMatcher(GET, POSTS_HANDLER));
	expect(router.getRoute(makeGet('/posts/123'))).toMatchObject(makeHandlerMatcher(GET, POST_HANDLER, ID_PARAM));
	expect(router.getRoute(makePost('/posts/123'))).toMatchObject(makeHandlerMatcher(POST, POST_UPDATE_HANDLER, ID_PARAM));
	expect(router.getRoute(makeGet('/optional/123'))).toMatchObject(makeHandlerMatcher(GET, OPTIONAL_PARAM_HANDLER, ID_PARAM));
	expect(router.getRoute(makeGet('/optional'))).toMatchObject(makeHandlerMatcher(GET, OPTIONAL_PARAM_HANDLER));
	expect(router.getRoute(makeGet('/wildcard/with/more/stuff'))).toMatchObject(makeHandlerMatcher(GET, WILDCARD_HANDLER, { extra: ['with', 'more', 'stuff'] }));
	expect(router.getRoute(makeGet('/wildcard'))).toMatchObject(makeHandlerMatcher(GET, WILDCARD_HANDLER), {});
	expect(router.getRoute(makeGet('/bread/peanut-butter/jelly/bread'))).toMatchObject(makeHandlerMatcher(GET, SANDWICH_HANDLER), { meat: ['peanut-butter', 'jelly'] });
});
