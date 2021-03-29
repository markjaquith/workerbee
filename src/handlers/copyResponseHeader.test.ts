import RequestManager from '../RequestManager';
import copyResponseHeader from './copyResponseHeader';

const copyFooHeaderToBar = copyResponseHeader('foo', 'bar');
const phase = 'response';

test('copyResponseHeader()', async () => {
	const response = new Response('Response', {
		headers: {
			foo: 'foo',
		},
	});

	const manager = new RequestManager().makeData({
		response,
		phase,
	});

	expect(response.headers.has('foo')).toBe(true);
	expect(response.headers.has('bar')).toBe(false);
	const result = (await copyFooHeaderToBar(manager)) as Response;
	expect(result.headers.has('foo')).toBe(true);
	expect(result.headers.has('bar')).toBe(true);
	expect(result.headers.get('bar')).toBe('foo');
});

test('copyResponseHeader() without any changes', async () => {
	const response = new Response('Response');
	const manager = new RequestManager().makeData({
		response,
		phase,
	});

	expect(response.headers.has('foo')).toBe(false);
	expect(response.headers.has('bar')).toBe(false);
	const result = await copyFooHeaderToBar(manager);
	expect(result).toBeUndefined();
});

test('copyResponseHeader() with zero length header', async () => {
	const response = new Response('Response', {
		headers: {
			foo: '',
		},
	});
	const manager = new RequestManager().makeData({
		response,
		phase,
	});

	expect(response.headers.has('foo')).toBe(true);
	expect(response.headers.has('bar')).toBe(false);
	const result = await copyFooHeaderToBar(manager);
	expect(result).toBeUndefined();
});

test('copyResponseHeader() with existing target header', async () => {
	const response = new Response('Response', {
		headers: {
			foo: 'foo',
			bar: 'bar',
		},
	});
	const manager = new RequestManager().makeData({
		response,
		phase,
	});

	expect(response.headers.has('foo')).toBe(true);
	expect(response.headers.has('bar')).toBe(true);
	const result = (await copyFooHeaderToBar(manager)) as Response;
	expect(result.headers.has('foo')).toBe(true);
	expect(result.headers.has('bar')).toBe(true);
	expect(result.headers.get('bar')).toBe('foo');
});
