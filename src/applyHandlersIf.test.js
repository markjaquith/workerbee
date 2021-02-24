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
	const trueRequestSpy = jest.fn(mockResponse());
	const falseRequestSpy = jest.fn(mockResponse());
	const trueResponseSpy = jest.fn(mockResponse());
	const falseResponseSpy = jest.fn(mockResponse());

	const manager = new RequestManager({
		request: [
			applyHandlersIf(() => false, falseRequestSpy),
			applyHandlersIf(() => true, trueRequestSpy),
		],
		response: [
			applyHandlersIf(() => false, falseResponseSpy),
			applyHandlersIf(() => true, trueResponseSpy),
		],
	});

	await manager.makeResponse(makeEvent());

	expect(trueRequestSpy).toHaveBeenCalled();
	expect(trueResponseSpy).toHaveBeenCalled();
	expect(falseRequestSpy).not.toHaveBeenCalled();
	expect(falseResponseSpy).not.toHaveBeenCalled();
});
