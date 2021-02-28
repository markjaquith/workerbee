import hasParam from './hasParam';

const MESSAGE = {
	url: new URL('https://x.co/?foo=bar&foo2&foo3=bar3'),
};

test('hasParam', () => {
	expect(hasParam('foo', MESSAGE)).toBe(true);
	expect(hasParam('foo2', MESSAGE)).toBe(true);
	expect(hasParam('foo3', MESSAGE)).toBe(true);
	expect(hasParam('foo4', MESSAGE)).toBe(false);
});
