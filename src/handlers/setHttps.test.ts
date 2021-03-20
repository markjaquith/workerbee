import RequestManager from '../RequestManager';
import setHttps from './setHttps';

const request = new Request('http://example.com/');
const manager = new RequestManager();
const handlerProcessor = {
	addRequestHandler: manager.addRequestHandler,
	addResponseHandler: manager.addResponseHandler,
	request,
	current: request,
	originalRequest: request,
	response: null,
	phase: 'request',
	params: {},
};

const HTTPS = 'https';

test('setProtocol()', async () => {
	const result = await setHttps()(handlerProcessor);
	const url = new URL(result.url);
	expect(url.protocol).toBe(`${HTTPS}:`);
});
