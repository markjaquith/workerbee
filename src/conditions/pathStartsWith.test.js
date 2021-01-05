import pathStartsWith from './pathStartsWith';

const startsWithFoo = pathStartsWith('/foo');
const startsWithBarFoo = pathStartsWith('/bar/foo');

test('paths are matched', () => {
	const request = {
		url: new URL('https://example.com/foo'),
	};

	expect(startsWithFoo({ request })).toBe(true);
	expect(startsWithBarFoo({ request })).toBe(false);
});
