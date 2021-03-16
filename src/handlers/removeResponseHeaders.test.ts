import removeResponseHeaders from './removeResponseHeaders';

const removeFooAndBarHeaders = removeResponseHeaders(['foo', 'bar']);

test('removeResponseHeaders() for existing headers', async () => {
	const response = new Response('Response', {
		headers: {
			foo: 'foo',
			bar: 'bar',
			baz: 'baz',
		},
	});

	expect(response.headers.has('foo')).toBe(true);
	expect(response.headers.has('bar')).toBe(true);
	expect(response.headers.has('baz')).toBe(true);

	const result = await removeFooAndBarHeaders({ response });
	expect(result.headers.has('foo')).toBe(false);
	expect(result.headers.has('bar')).toBe(false);
	expect(result.headers.has('baz')).toBe(true);
});

test('removeResponseHeaders() when headers are not present', async () => {
	const response = new Response('Response', {
		headers: {
			baz: 'baz',
		},
	});

	expect(response.headers.has('foo')).toBe(false);
	expect(response.headers.has('bar')).toBe(false);
	expect(response.headers.has('baz')).toBe(true);

	const result = await removeFooAndBarHeaders({ response });
	expect(result).toBeUndefined(); // Because there was nothing to change.
});

test('removeResponseHeaders() called without headers', async () => {
	const removeNothing = removeResponseHeaders();
	const response = new Response('Response', {
		headers: {
			baz: 'baz',
		},
	});

	expect(response.headers.has('foo')).toBe(false);
	expect(response.headers.has('bar')).toBe(false);
	expect(response.headers.has('baz')).toBe(true);

	const result = await removeNothing({ response });
	expect(result).toBeUndefined(); // Because there was nothing to change.
});
