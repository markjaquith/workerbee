import removeResponseHeaders from './removeResponseHeaders';

test('removeResponseHeaders()', async () => {
	const removeFooAndBarHeaders = removeResponseHeaders(['foo', 'bar']);
	const response = new Response('Response', {
		headers: new Headers({
			foo: 'foo',
			bar: 'bar',
		}),
	});

	expect(response.headers.has('foo')).toBe(true);
	expect(response.headers.has('bar')).toBe(true);

	const result = await removeFooAndBarHeaders({ response });
	expect(result.headers.has('foo')).toBe(false);
	expect(result.headers.has('bar')).toBe(false);
});
