import removeResponseHeaders from './removeResponseHeaders';

test('removeResponseHeaders()', async () => {
	const removeFooAndBarHeaders = removeResponseHeaders(['foo', 'bar']);
	const responseWithFooAndBar = new Response('Response', {
		headers: new Headers({
			foo: 'foo',
			bar: 'bar',
		}),
	});
	const responseWithoutFooAndBar = new Response('Response');

	expect(responseWithFooAndBar.headers.has('foo')).toBe(true);
	expect(responseWithFooAndBar.headers.has('bar')).toBe(true);

	const result = await removeFooAndBarHeaders({
		response: responseWithFooAndBar,
	});
	expect(result.headers.has('foo')).toBe(false);
	expect(result.headers.has('bar')).toBe(false);

	const result2 = await removeFooAndBarHeaders({
		response: responseWithoutFooAndBar,
	});
	expect(result.headers.has('foo')).toBe(false);
	expect(result.headers.has('bar')).toBe(false);
});
