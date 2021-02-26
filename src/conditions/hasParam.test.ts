import hasParam from './hasParam';

const REQUEST = {
	url: new URL('https://x.co/?foo=bar&foo2&foo3=bar3'),
};

const hasFooParam = hasParam('foo');

test('hasParam', () => {
	expect(hasParam('foo', REQUEST)).toBe(true);
	expect(hasFooParam(REQUEST)).toBe(true); // Curried.
	expect(hasParam('foo2', REQUEST)).toBe(true);
	expect(hasParam('foo3', REQUEST)).toBe(true);
	expect(hasParam('foo4', REQUEST)).toBe(false);
});
