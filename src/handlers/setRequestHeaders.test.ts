import setRequestHeaders from './setRequestHeaders';

const REQUEST = {
	request: new Request('https://example.com/', {
		headers: new Headers({
			foo: 'foo',
		}),
	}),
};

test('setRequestHeaders()', async () => {
	const result = await setRequestHeaders({
		bar: 'bar',
	})(REQUEST);
	expect(result.headers.get('foo')).toBe('foo');
	expect(result.headers.get('bar')).toBe('bar');
});
