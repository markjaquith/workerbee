import Router from './Router';
import httpMocks from 'node-mocks-http';

const makeHandler = () => ({ request: Symbol(), response: Symbol() });

const ROOT_HANDLER = makeHandler();
const POSTS_HANDLER = makeHandler();
const POST_HANDLER = makeHandler();
const POST_UPDATE_HANDLER = makeHandler();

const DOMAIN = 'https://example.com';
const router = new Router();
router.get('/', ROOT_HANDLER);
router.get('/posts', POSTS_HANDLER);
router.get('/posts/:id', POST_HANDLER);
router.post('/posts/:id', POST_UPDATE_HANDLER);

function makeGet(path) {
	return httpMocks.createRequest({
		method: 'GET', 
		url: 'https://example.com' + path,
	});
}

function makePost(path) {
	return httpMocks.createRequest({
		method: 'POST',
		url: 'https://example.com' + path,
	});
}

test('Router', () => {
	expect(makeGet('/').path).toBe('/');
	expect(router.getRoute(makeGet('/'))).toMatchObject({
		method: 'GET',
		handlers: ROOT_HANDLER,
		params: {},
	});
	expect(router.getRoute(makeGet('/posts'))).toMatchObject({
		method: 'GET',
		handlers: POSTS_HANDLER,
		params: {},
	});
	expect(router.getRoute(makeGet('/posts/123'))).toMatchObject({
		method: 'GET',
		handlers: POST_HANDLER,
		params: { id: '123' },
	});
	expect(router.getRoute(makePost('/posts/123'))).toMatchObject({
		method: 'POST',
		handlers: POST_UPDATE_HANDLER,
		params: { id: '123' },
	});
});
