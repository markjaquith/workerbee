import RequestManager from './RequestManager';
import setRequestHeaders from './handlers/setRequestHeaders';
import setResponseHeaders from './handlers/setResponseHeaders';

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
const boofHandler = jest.fn();
const alwaysRequestHandler = jest.fn();
const alwaysResponseHandler = jest.fn();

const manager = new RequestManager({
	request: alwaysRequestHandler,
	response: alwaysResponseHandler,
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

test('Bad route triggers no route handlers', async () => {
	await handleGet('/no');
	[fooHandler, barHandler, bazHandler].forEach((fn) =>
		expect(fn).not.toHaveBeenCalled(),
	);
	[alwaysRequestHandler, alwaysResponseHandler].forEach((fn) => {
		expect(fn).toHaveBeenCalledTimes(1);
	});
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

test('Adding handlers without { immediate: true } appends', async () => {
	const manager = new RequestManager({
		request: ({ addRequestHandler, addResponseHandler }) => {
			addRequestHandler(fooHandler);
			addRequestHandler(barHandler);
			addResponseHandler(bazHandler);
			addResponseHandler(boofHandler);
		},
	});

	await manager.makeResponse(makeEvent());
	expect(fooHandler).toHaveBeenCalledTimes(1);
	expect(barHandler).toHaveBeenCalledTimes(1);
	expect(fooHandler.mock.invocationCallOrder[0]).toBeLessThan(
		barHandler.mock.invocationCallOrder[0],
	);

	expect(bazHandler).toHaveBeenCalledTimes(1);
	expect(boofHandler).toHaveBeenCalledTimes(1);
	expect(bazHandler.mock.invocationCallOrder[0]).toBeLessThan(
		boofHandler.mock.invocationCallOrder[0],
	);
});

test('Adding handlers with { immediate: true } prepends', async () => {
	const manager = new RequestManager({
		request: ({ addRequestHandler, addResponseHandler }) => {
			addRequestHandler(fooHandler);
			addRequestHandler(barHandler, { immediate: true });
			addResponseHandler(bazHandler);
			addResponseHandler(boofHandler, { immedate: true });
		},
	});

	await manager.makeResponse(makeEvent());
	expect(fooHandler).toHaveBeenCalledTimes(1);
	expect(barHandler).toHaveBeenCalledTimes(1);
	expect(barHandler.mock.invocationCallOrder[0]).toBeLessThan(
		fooHandler.mock.invocationCallOrder[0],
	);

	expect(bazHandler).toHaveBeenCalledTimes(1);
	expect(boofHandler).toHaveBeenCalledTimes(1);
	expect(bazHandler.mock.invocationCallOrder[0]).toBeLessThan(
		boofHandler.mock.invocationCallOrder[0],
	);
});

test('Returning an early response skips subsequent request handlers', async () => {
	const urlChangingHandler = jest.fn(
		async ({ request }) => new Request(request.url + 'appended'),
	);
	const headerInjectingHandler = jest.fn(setRequestHeaders({ foo: 'foo' }));
	const earlyReturn = jest.fn(async () => new Response('Early'));
	const responseHeaderInjectingHandler = jest
		.fn(setResponseHeaders({ bar: 'bar' }))
		.mockName('responseHeaderInjectingHandler');
	const manager = new RequestManager({
		request: [
			headerInjectingHandler,
			urlChangingHandler,
			earlyReturn,
			barHandler,
		],
		response: [bazHandler, responseHeaderInjectingHandler],
	});
	const result = await manager.makeResponse(makeEvent());
	expect(result).toBeInstanceOf(Response);
	expect(await result.text()).toBe('Early');
	expect(result.headers.get('bar')).toBe('bar');
	expect(headerInjectingHandler).toHaveBeenCalledTimes(1);
	expect(urlChangingHandler).toHaveBeenCalledTimes(1);
	expect(earlyReturn).toHaveBeenCalledTimes(1);
	expect(barHandler).not.toHaveBeenCalled();
	expect(bazHandler).toHaveBeenCalledTimes(1);
	expect(responseHeaderInjectingHandler).toHaveBeenCalledTimes(1);
});

test('Logging', () => {
	const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
	const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation();
	const consoleGroupEndSpy = jest
		.spyOn(console, 'groupEnd')
		.mockImplementation();
	const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

	const manager = new RequestManager();
	// manager.testing defaults to true, which should only allow errors to pass.
	manager.log('log');
	manager.group('group');
	manager.groupEnd();
	manager.error('error');

	expect(consoleLogSpy).not.toHaveBeenCalled();
	expect(consoleGroupSpy).not.toHaveBeenCalled();
	expect(consoleGroupEndSpy).not.toHaveBeenCalled();
	expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
	expect(consoleErrorSpy).toHaveBeenLastCalledWith('error');

	// Now we override manager.testing, and everything thing should pass.
	manager.testing = false;
	jest.clearAllMocks();
	manager.log('log');
	manager.group('group');
	manager.groupEnd();
	manager.error('error');

	expect(consoleLogSpy).toHaveBeenCalledTimes(1);
	expect(consoleLogSpy).toHaveBeenLastCalledWith('log');
	expect(consoleGroupSpy).toHaveBeenCalledTimes(1);
	expect(consoleGroupSpy).toHaveBeenLastCalledWith('group');
	expect(consoleGroupEndSpy).toHaveBeenCalledTimes(1);
	expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
	expect(consoleErrorSpy).toHaveBeenLastCalledWith('error');

	[consoleLogSpy, consoleGroupSpy, consoleGroupEndSpy, consoleErrorSpy].forEach(
		(spy) => spy.mockReset,
	);
});

test('Request handler returning something other than Request, Response, or undefined triggers error', async () => {
	const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
	const manager = new RequestManager({
		// @ts-ignore
		request: () => 'uh oh',
	});
	await manager.makeResponse(makeEvent());
	expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
	expect(consoleErrorSpy).toHaveBeenLastCalledWith(
		'Your handler returned something other than a Request, a Response, or undefined',
		'uh oh',
	);
});

test('Response handler returning something other than Response or undefined triggers error', async () => {
	const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
	const badRequestResponse = new Request('https://youdoneboofed.example.com/');
	const manager = new RequestManager({
		// @ts-ignore
		response: async () => badRequestResponse,
	});
	await manager.makeResponse(makeEvent());
	expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
	expect(consoleErrorSpy).toHaveBeenLastCalledWith(
		'Unexpectedly received a Request back from a Response handler',
		badRequestResponse,
	);
});

test('Adding a cfPropertiesHandler results in fetch() called appropriately', async () => {
	const originalFetch = global.fetch;
	global.fetch = jest.fn(global.fetch);
	const additionalCfProperties = { foo: 'bar' };
	const manager = new RequestManager({
		request: async ({ addCfPropertiesHandler }) => {
			addCfPropertiesHandler((cfProperties) => ({
				...cfProperties,
				...additionalCfProperties,
			}));
		},
	});
	const event = makeEvent();
	const request = event.request;
	await manager.makeResponse(makeEvent());
	expect(global.fetch).toHaveBeenCalledTimes(1);
	expect(global.fetch).toHaveBeenLastCalledWith(request, {
		cf: additionalCfProperties,
	});
	global.fetch = originalFetch;
});
