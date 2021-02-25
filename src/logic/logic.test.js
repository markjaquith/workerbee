import ifRequest from './ifRequest.js';
import ifResponse from './ifResponse.js';
import any from './any.js';
import all from './all.js';
import none from './none.js';
import RequestManager from '../RequestManager.js';

const DOMAIN = 'https://example.com';
const GET = 'GET';

const yes = () => true;
const no = () => false;

function makeEvent() {
	return {
		request: new Request(DOMAIN + '/', {
			method: GET,
			headers: {
				foo: 'bar',
			},
		}),
	};
}

test('ifRequest and ifResponse', async () => {
	const trueRequestSpy = jest.fn();
	const falseRequestSpy = jest.fn();
	const trueResponseSpy = jest.fn();
	const falseResponseSpy = jest.fn();

	const manager = new RequestManager({
		request: [
			ifRequest(no, falseRequestSpy), // 0.
			ifRequest(yes, trueRequestSpy), // 1.
		],
		response: [
			ifResponse(no, falseResponseSpy), // 0.
			ifResponse(yes, trueResponseSpy), // 1.
		],
	});

	await manager.makeResponse(makeEvent());

	expect(trueRequestSpy).toHaveBeenCalledTimes(1);
	expect(trueResponseSpy).toHaveBeenCalledTimes(1);
	expect(falseRequestSpy).not.toHaveBeenCalled();
	expect(falseResponseSpy).not.toHaveBeenCalled();
});

test('complex logic', async () => {
	const trueRequestSpy = jest.fn();
	const falseRequestSpy = jest.fn();
	const trueResponseSpy = jest.fn();
	const falseResponseSpy = jest.fn();

	const manager = new RequestManager({
		request: [
			ifRequest(all(yes, yes, yes, yes), trueRequestSpy), // 1.
			ifRequest(any(yes, no, no, no), trueRequestSpy), // 2.
			ifRequest(none(no, no, no), trueRequestSpy), // 3.
			ifRequest(none(no, no, yes), falseRequestSpy), // 0.
		],
		response: [
			ifResponse(
				all(all(yes, yes), any(yes, no), none(all(yes, no))),
				trueResponseSpy
			), // 1.
			ifResponse(
				all(all(yes, yes), any(yes, no), none(all(yes, yes))),
				falseResponseSpy
			), // 0.
		],
	});

	await manager.makeResponse(makeEvent());

	expect(trueRequestSpy).toHaveBeenCalledTimes(3);
	expect(trueResponseSpy).toHaveBeenCalledTimes(1);
	expect(falseRequestSpy).not.toHaveBeenCalled();
	expect(falseResponseSpy).not.toHaveBeenCalled();
});
