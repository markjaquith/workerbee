import headerContains from './headerContains';

const fooHeaderContainsBar = headerContains('foo', 'bar');
const fooHeaderContainsBaz = headerContains('foo', 'baz');
const barHeaderContainsBar = headerContains('bar', 'bar');

test('headers are matched', () => {
	const headers = new Headers({
		foo: 'contains bar in the middle',
	});

	expect(fooHeaderContainsBar({ headers })).toBe(true);
	expect(fooHeaderContainsBaz({ headers })).toBe(false);
	expect(barHeaderContainsBar({ headers })).toBe(false);
});
