import setRequestHeaders from './setRequestHeaders';

const REQUEST = {
	request: new Request('https://example.com/', {
		headers: new Headers({
			foo: 'foo',
		}),
	}),
};

describe('setRequestHeaders()', () => {
	test('set headers with object', async () => {
		const result = await setRequestHeaders({
			bar: 'bar',
		})(REQUEST);
		expect(result).toBeInstanceOf(Request);
		expect(result.headers.get('foo')).toBe('foo');
		expect(result.headers.get('bar')).toBe('bar');
	});

	test('set headers with array', async () => {
		const result = await setRequestHeaders([['bar', 'bar']])(REQUEST);
		expect(result).toBeInstanceOf(Request);
		expect(result.headers.get('foo')).toBe('foo');
		expect(result.headers.get('bar')).toBe('bar');
	});

	test('set headers with current value', async () => {
		const result = await setRequestHeaders([['foo', 'foo']])(REQUEST);
		expect(result).toBeUndefined();
	});

	test('set headers with no value', async () => {
		const result = await setRequestHeaders()(REQUEST);
		expect(result).toBeUndefined();
	});
});
