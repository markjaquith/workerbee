import setResponseHeaders from './setResponseHeaders';
import RequestManager from '../RequestManager';

const manager = new RequestManager().makeData({
	response: new Response('Body', {
		headers: {
			foo: 'foo',
		},
	}),
	phase: 'response',
});

describe('setResponseHeaders()', () => {
	test('set headers with object', async () => {
		const result = (await setResponseHeaders({
			bar: 'bar',
		})(manager)) as Response;
		expect(result).toBeInstanceOf(Response);
		expect(result.headers.get('foo')).toBe('foo');
		expect(result.headers.get('bar')).toBe('bar');
	});

	test('set headers with array', async () => {
		const result = (await setResponseHeaders([['bar', 'bar']])(
			manager,
		)) as Response;
		expect(result).toBeInstanceOf(Response);
		expect(result.headers.get('foo')).toBe('foo');
		expect(result.headers.get('bar')).toBe('bar');
	});

	test('set headers with current value', async () => {
		const result = await setResponseHeaders([['foo', 'foo']])(manager);
		expect(result).toBeUndefined();
	});

	test('set headers with no value', async () => {
		const result = await setResponseHeaders()(manager);
		expect(result).toBeUndefined();
	});
});
