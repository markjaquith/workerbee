import RequestManager from '../RequestManager';
import appendResponseHeaders from './appendResponseHeaders';

const append = appendResponseHeaders({
	bar: 'foo',
	zoo: 'boo',
});
const appendNothing = appendResponseHeaders();

function makeManager(headers: { [header: string]: string }) {
	return new RequestManager().makeData({
		response: new Response('Response', {
			headers,
		}),
		phase: 'response',
	});
}

describe('appendResponseHeaders()', () => {
	test('appends to existing values', async () => {
		const manager = makeManager({
			bar: 'bar',
			zoo: 'zoo',
			untouched: 'same',
		});
		const result = (await append(manager)) as Response;
		expect(result.headers.get('bar')).toBe('bar, foo');
		expect(result.headers.get('zoo')).toBe('zoo, boo');
		expect(result.headers.get('untouched')).toBe('same');
	});

	test('writes new values', async () => {
		const manager = makeManager({
			untouched: 'same',
		});
		const result = (await append(manager)) as Response;
		expect(result.headers.get('bar')).toBe('foo');
		expect(result.headers.get('zoo')).toBe('boo');
		expect(result.headers.get('untouched')).toBe('same');
	});

	test('does nothing when nothing passed', async () => {
		const manager = makeManager({
			untouched: 'same',
		});
		const result = await appendNothing(manager);
		expect(result).toBeUndefined();
	});

	test('does nothing when value already in header', async () => {
		const manager = makeManager({
			bar: 'foo',
			zoo: 'boo',
			untouched: 'same',
		});
		const result = await append(manager);
		expect(result).toBeUndefined();
	});
});
