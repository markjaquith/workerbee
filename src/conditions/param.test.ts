import { partialRight } from '../utils';
import { endsWith, startsWith } from '../logic';
import param from './param';

const MESSAGE = {
	url: new URL('https://x.co/?foo=bar-123&foo2&foo3=bar3-123'),
};

const applyParam = partialRight(param, [MESSAGE]);

test('param', () => {
	expect(applyParam('foo', startsWith('bar'))).toBe(true);
	expect(applyParam('foo', endsWith('123'))).toBe(true);
	expect(applyParam('baz', startsWith('foo'))).toBe(false);
});
