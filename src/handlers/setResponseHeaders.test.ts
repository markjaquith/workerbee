import setResponseHeaders from './setResponseHeaders';

const RESPONSE = {
	response: new Response('Body', {
		headers: new Headers({
			foo: 'foo',
		}),
	}),
};

test('setResponseHeaders()', async () => {
	const result = await setResponseHeaders({
		bar: 'bar',
	})(RESPONSE);
	expect(result.headers.get('foo')).toBe('foo');
});
