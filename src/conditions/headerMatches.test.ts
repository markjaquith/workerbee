import headerMatches from './headerMatches';

const fooHeaderContainsBar = headerMatches('foo', (header) =>
	header.includes('bar'),
);
const fooHeaderContainsBaz = headerMatches('foo', (header) =>
	header.includes('baz'),
);
const barHeaderContainsBar = headerMatches('bar', (header) =>
	header.includes('bar'),
);
const fooHeaderStartsWithContains = headerMatches('foo', (header) =>
	header.startsWith('contains'),
);

test('headers are matched', () => {
	const headers = new Headers({
		foo: 'contains bar in the middle',
	});

	expect(fooHeaderContainsBar({ headers })).toBe(true);
	expect(fooHeaderContainsBaz({ headers })).toBe(false);
	expect(barHeaderContainsBar({ headers })).toBe(false);
	expect(fooHeaderStartsWithContains({ headers })).toBe(true);
});
