import setResponseHeaders from './setResponseHeaders';

const RESPONSE = {
	response: new Response('Body', {
		headers: {
			foo: 'foo',
		},
	}),
};

describe('setResponseHeaders()', () => {
	test('set headers with object', async () => {
		const result = await setResponseHeaders({
			bar: 'bar',
		})(RESPONSE);
		expect(result).toBeInstanceOf(Response);
		expect(result.headers.get('foo')).toBe('foo');
		expect(result.headers.get('bar')).toBe('bar');
	});

	test('set headers with array', async () => {
		const result = await setResponseHeaders([['bar', 'bar']])(RESPONSE);
		expect(result).toBeInstanceOf(Response);
		expect(result.headers.get('foo')).toBe('foo');
		expect(result.headers.get('bar')).toBe('bar');
	});

	test('set headers with current value', async () => {
		const result = await setResponseHeaders([['foo', 'foo']])(RESPONSE);
		expect(result).toBeUndefined();
	});

	test('set headers with no value', async () => {
		const result = await setResponseHeaders()(RESPONSE);
		expect(result).toBeUndefined();
	});
});
