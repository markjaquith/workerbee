import RequestManager from './RequestManager';

const DOMAIN = 'https://example.com';
const GET = 'GET';

function makeEvent(path = '/') {
	return {
		request: new Request(DOMAIN + path, {
			method: GET,
			headers: {
				foo: 'bar',
			},
		}),
	};
}

const fooHandler = jest.fn();
const barHandler = jest.fn();
const bazHandler = jest.fn();

const manager = new RequestManager({
	routes: (router) => {
		router.get('/foo/bar', fooHandler, barHandler);
		router.get('/foo', fooHandler);
		router.get('/bar', barHandler);
		router.get('/baz', { request: [bazHandler] });
		router.get('/foo/bar/object', {
			request: fooHandler,
			response: barHandler,
		});
	},
});

async function handleGet(path: string) {
	await manager.makeResponse(makeEvent(path));
}

afterEach(() => {
	jest.clearAllMocks();
});

test('Bad route triggers no handlers', async () => {
	await handleGet('/no');
	[fooHandler, barHandler, bazHandler].forEach((fn) =>
		expect(fn).not.toHaveBeenCalled(),
	);
});

test('/foo/bar triggers two handlers', async () => {
	await handleGet('/foo/bar');
	expect(bazHandler).not.toHaveBeenCalled();
	expect(fooHandler).toHaveBeenCalledTimes(1);
	expect(barHandler).toHaveBeenCalledTimes(1);
});

test('/foo triggers one handler', async () => {
	await handleGet('/foo');
	expect(bazHandler).not.toHaveBeenCalled();
	expect(barHandler).not.toHaveBeenCalled();
	expect(fooHandler).toHaveBeenCalledTimes(1);
});

test('/bar triggers one handler', async () => {
	await handleGet('/bar');
	expect(bazHandler).not.toHaveBeenCalled();
	expect(fooHandler).not.toHaveBeenCalled();
	expect(barHandler).toHaveBeenCalledTimes(1);
});

test('/baz triggers one handler', async () => {
	await handleGet('/baz');
	expect(fooHandler).not.toHaveBeenCalled();
	expect(barHandler).not.toHaveBeenCalled();
	expect(bazHandler).toHaveBeenCalledTimes(1);
});

test('/foo/bar/object triggers two handlers', async () => {
	await handleGet('/foo/bar/object');
	expect(fooHandler).toHaveBeenCalledTimes(1);
	expect(barHandler).toHaveBeenCalledTimes(1);
	expect(bazHandler).not.toHaveBeenCalled();
});
