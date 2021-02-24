import applyHandlersIf from './applyHandlersIf';
import httpMocks from 'node-mocks-http';
import RequestManager from './RequestManager';

const DOMAIN = 'https://example.com';
const GET = 'GET';

function mockResponse() {
	return async function () {
		return httpMocks.createResponse({});
	}
}

function makeEvent() {
	return {
		request: httpMocks.createRequest({
			method: GET, 
			url: DOMAIN + '/',
			headers: {
				foo: 'bar',
			}
		}),
	};
}

test('applyHandlersIf', async () => {
	let trueSpy = jest.fn(mockResponse());
	let falseSpy = jest.fn(mockResponse());
	let manager = new RequestManager({
		request: [
			applyHandlersIf(() => false, falseSpy),
			applyHandlersIf(() => true, trueSpy),
		],
	});

	await manager.makeResponse(makeEvent());

	expect(trueSpy).toHaveBeenCalled();
	expect(falseSpy).not.toHaveBeenCalled();
});
