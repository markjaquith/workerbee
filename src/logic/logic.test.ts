import addHandlerIf from './addHandlerIf';
import any from './any';
import all from './all';
import none from './none';
import RequestManager from '../RequestManager';

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

test('addHandlerIf', async () => {
	const trueRequestSpy = jest.fn();
	const falseRequestSpy = jest.fn();
	const trueResponseSpy = jest.fn();
	const falseResponseSpy = jest.fn();

	const manager = new RequestManager({
		request: [
			addHandlerIf(no, falseRequestSpy), // 0.
			addHandlerIf(yes, trueRequestSpy), // 1.
		],
		response: [
			addHandlerIf(no, falseResponseSpy), // 0.
			addHandlerIf(yes, trueResponseSpy), // 1.
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
			addHandlerIf(all(yes, yes, yes, yes), trueRequestSpy), // 1.
			addHandlerIf(any(yes, no, no, no), trueRequestSpy), // 2.
			addHandlerIf(none(no, no, no), trueRequestSpy), // 3.
			addHandlerIf(none(no, no, yes), falseRequestSpy), // 0.
		],
		response: [
			addHandlerIf(
				all(all(yes, yes), any(yes, no), none(all(yes, no))),
				trueResponseSpy,
			), // 1.
			addHandlerIf(
				all(all(yes, yes), any(yes, no), none(all(yes, yes))),
				falseResponseSpy,
			), // 0.
		],
	});

	await manager.makeResponse(makeEvent());

	expect(trueRequestSpy).toHaveBeenCalledTimes(3);
	expect(trueResponseSpy).toHaveBeenCalledTimes(1);
	expect(falseRequestSpy).not.toHaveBeenCalled();
	expect(falseResponseSpy).not.toHaveBeenCalled();
});
