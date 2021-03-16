import appendResponseHeaders from './appendResponseHeaders';

const append = appendResponseHeaders({
	bar: 'foo',
	zoo: 'boo',
});
const appendNothing = appendResponseHeaders();

describe('appendResponseHeaders()', () => {
	test('appends to existing values', async () => {
		const response = new Response('Response', {
			headers: {
				bar: 'bar',
				zoo: 'zoo',
				untouched: 'same',
			},
		});
		const result = await append({ response });
		expect(result.headers.get('bar')).toBe('bar, foo');
		expect(result.headers.get('zoo')).toBe('zoo, boo');
		expect(result.headers.get('untouched')).toBe('same');
	});

	test('writes new values', async () => {
		const response = new Response('Response', {
			headers: {
				untouched: 'same',
			},
		});
		const result = await append({ response });
		expect(result.headers.get('bar')).toBe('foo');
		expect(result.headers.get('zoo')).toBe('boo');
		expect(result.headers.get('untouched')).toBe('same');
	});

	test('does nothing when nothing passed', async () => {
		const response = new Response('Response', {
			headers: {
				untouched: 'same',
			},
		});
		const result = await appendNothing({ response });
		expect(result).toBeUndefined();
	});

	test('does nothing when value already in header', async () => {
		const response = new Response('Response', {
			headers: {
				bar: 'foo',
				zoo: 'boo',
				untouched: 'same',
			},
		});
		const result = await append({ response });
		expect(result).toBeUndefined();
	});
});
