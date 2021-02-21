import Router from './Router';
import httpMocks from 'node-mocks-http';

const ROOT_HANDLER = Symbol();
const POSTS_HANDLER = Symbol();
const POST_HANDLER = Symbol();
const POST_UPDATE_HANDLER = Symbol();

const router = new Router();
router.get('/', ROOT_HANDLER);
router.get('/posts', POSTS_HANDLER);
router.get('/posts/:id', POST_HANDLER);
router.post('/posts/:id', POST_UPDATE_HANDLER);

function makeGet(path, options = {}) {
	return httpMocks.createRequest({
		method: 'GET',
		url: 'https://example.com' + path,
		...options,
	});
}

function makePost(path, options = {}) {
	return httpMocks.createRequest({
		method: 'POST',
		url: 'https://example.com' + path,
		...options,
	})
}

test('Router', () => {
	expect(makeGet('/').path).toBe('/');
	expect(router.getRoute(makeGet('/'))).toMatchObject({ handlers: ROOT_HANDLER, params: {} });
	expect(router.getRoute(makeGet('/posts'))).toMatchObject({ handlers: POSTS_HANDLER, params: {} });
	expect(router.getRoute(makeGet('/posts/123'))).toMatchObject({ handlers: POST_HANDLER, params: { id: "123" } });
	expect(router.getRoute(makePost('/posts/123'))).toMatchObject({ handlers: POST_UPDATE_HANDLER, params: { id: "123" } });
});
