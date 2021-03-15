import copyResponseHeader from './copyResponseHeader';

const copyFooHeaderToBar = copyResponseHeader('foo', 'bar');

test('copyResponseHeader()', async () => {
	const response = new Response('Response', {
		headers: new Headers({
			foo: 'foo',
		}),
	});

	expect(response.headers.has('foo')).toBe(true);
	expect(response.headers.has('bar')).toBe(false);
	const result = await copyFooHeaderToBar({ response });
	expect(result.headers.has('foo')).toBe(true);
	expect(result.headers.has('bar')).toBe(true);
	expect(result.headers.get('bar')).toBe('foo');
});

test('copyResponseHeader() without any changes', async () => {
	const response = new Response('Response');

	expect(response.headers.has('foo')).toBe(false);
	expect(response.headers.has('bar')).toBe(false);
	const result = await copyFooHeaderToBar({ response });
	expect(result).toBeUndefined();
});

test('copyResponseHeader() wtih existing target header', async () => {
	const response = new Response('Response', {
		headers: new Headers({
			foo: 'foo',
			bar: 'bar',
		}),
	});

	expect(response.headers.has('foo')).toBe(true);
	expect(response.headers.has('bar')).toBe(true);
	const result = await copyFooHeaderToBar({ response });
	expect(result.headers.has('foo')).toBe(true);
	expect(result.headers.has('bar')).toBe(true);
	expect(result.headers.get('bar')).toBe('foo');
});
