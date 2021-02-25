import Router from './Router';

const makeHandler = () => ({ request: Symbol(), response: Symbol() });

const ROOT_HANDLER = makeHandler();
const POSTS_HANDLER = makeHandler();
const POST_HANDLER = makeHandler();
const POST_UPDATE_HANDLER = makeHandler();
const OPTIONAL_PARAM_HANDLER = makeHandler();
const WILDCARD_HANDLER = makeHandler();
const SANDWICH_HANDLER = makeHandler();
const MOTHER_HANDLER = makeHandler();

const DOMAIN = 'https://example.com';
const GET = 'GET';
const POST = 'POST';
const ID_PARAM = { id: '123' };
const router = new Router();
router.get('/', ROOT_HANDLER);
router.get('/posts', POSTS_HANDLER);
router.get('/posts/:id', POST_HANDLER);
router.post('/posts/:id(\\d+)', POST_UPDATE_HANDLER);
router.get('/optional/:id?', OPTIONAL_PARAM_HANDLER);
router.get('/wildcard/:extra*', WILDCARD_HANDLER);
router.get('/bread/:meat+/bread', SANDWICH_HANDLER);
router.get('/mother{-:type}?', MOTHER_HANDLER);

function makeGet(path) {
	return new Request(DOMAIN + path, { method: GET });
}

function makePost(path) {
	return new Request(DOMAIN + path, { method: POST });
}

function makeHandlerMatcher(method, handlers, params = {}) {
	return { method, handlers, params };
}

test('Router', () => {
	expect(new URL(makeGet('/').url).pathname).toBe('/');
	expect(router.getRoute(makeGet('/'))).toMatchObject(makeHandlerMatcher(GET, ROOT_HANDLER));
	expect(router.getRoute(makeGet('/posts'))).toMatchObject(makeHandlerMatcher(GET, POSTS_HANDLER));
	expect(router.getRoute(makeGet('/posts/123'))).toMatchObject(makeHandlerMatcher(GET, POST_HANDLER, ID_PARAM));
	expect(router.getRoute(makePost('/posts/123'))).toMatchObject(makeHandlerMatcher(POST, POST_UPDATE_HANDLER, ID_PARAM));
	expect(router.getRoute(makeGet('/optional/123'))).toMatchObject(makeHandlerMatcher(GET, OPTIONAL_PARAM_HANDLER, ID_PARAM));
	expect(router.getRoute(makeGet('/optional'))).toMatchObject(makeHandlerMatcher(GET, OPTIONAL_PARAM_HANDLER));
	expect(router.getRoute(makeGet('/wildcard/with/more/stuff'))).toMatchObject(makeHandlerMatcher(GET, WILDCARD_HANDLER, { extra: ['with', 'more', 'stuff'] }));
	expect(router.getRoute(makeGet('/wildcard'))).toMatchObject(makeHandlerMatcher(GET, WILDCARD_HANDLER), {});
	expect(router.getRoute(makeGet('/bread/peanut-butter/jelly/bread'))).toMatchObject(makeHandlerMatcher(GET, SANDWICH_HANDLER), { meat: ['peanut-butter', 'jelly'] });
	expect(router.getRoute(makeGet('/bread/ham/bread'))).toMatchObject(makeHandlerMatcher(GET, SANDWICH_HANDLER), { meat: 'ham' });
	expect(router.getRoute(makeGet('/bread/bread'))).not.toMatchObject(makeHandlerMatcher(GET, SANDWICH_HANDLER));
	expect(router.getRoute(makeGet('/mother'))).toMatchObject(makeHandlerMatcher(GET, MOTHER_HANDLER));
	expect(router.getRoute(makeGet('/mother-in-law'))).toMatchObject(makeHandlerMatcher(GET, MOTHER_HANDLER, { type: "in-law" }));
	expect(router.getRoute(makeGet('/mothers'))).not.toMatchObject(makeHandlerMatcher(GET, MOTHER_HANDLER));
});
