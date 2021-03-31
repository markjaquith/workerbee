import addHandlerIf from './addHandlerIf'
import any from './any'
import all from './all'
import none from './none'
import RequestManager from '../RequestManager'

const DOMAIN = 'https://example.com'
const GET = 'GET'

const yes = () => true
const no = () => false

function makeEvent() {
	return {
		request: new Request(DOMAIN + '/', {
			method: GET,
			headers: {
				foo: 'bar',
			},
		}),
	}
}

test('addHandlerIf', async () => {
	const trueRequestSpy = jest.fn()
	const falseRequestSpy = jest.fn()
	const trueResponseSpy = jest.fn()
	const falseResponseSpy = jest.fn()

	const manager = new RequestManager({
		request: [
			addHandlerIf(no, falseRequestSpy), // 0.
			addHandlerIf(yes, trueRequestSpy), // 1.
		],
		response: [
			addHandlerIf(no, falseResponseSpy), // 0.
			addHandlerIf(yes, trueResponseSpy), // 1.
		],
	})

	await manager.makeResponse(makeEvent())

	expect(trueRequestSpy).toHaveBeenCalledTimes(1)
	expect(trueResponseSpy).toHaveBeenCalledTimes(1)
	expect(falseRequestSpy).not.toHaveBeenCalled()
	expect(falseResponseSpy).not.toHaveBeenCalled()
})

test('complex logic', async () => {
	const trueRequestSpy = jest.fn()
	const falseRequestSpy = jest.fn()
	const trueResponseSpy = jest.fn()
	const falseResponseSpy = jest.fn()
	const firstResponseSpy = jest.fn()
	const lastResponseSpy = jest.fn()

	const manager = new RequestManager({
		request: [
			addHandlerIf(
				all(yes, yes, yes, yes),
				firstResponseSpy,
				trueRequestSpy,
				lastResponseSpy,
			), // 1.
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
	})

	await manager.makeResponse(makeEvent())

	expect(trueRequestSpy).toHaveBeenCalledTimes(3)
	expect(trueResponseSpy).toHaveBeenCalledTimes(1)
	expect(falseRequestSpy).not.toHaveBeenCalled()
	expect(falseResponseSpy).not.toHaveBeenCalled()
	expect(firstResponseSpy).toHaveBeenCalledTimes(1)
	expect(lastResponseSpy).toHaveBeenCalledTimes(1)

	// Make sure they were called in the right order.
	expect(firstResponseSpy.mock.invocationCallOrder[0]).toBeLessThan(
		lastResponseSpy.mock.invocationCallOrder[0],
	)
})
