import { endsWith, startsWith } from '../logic';
import param from './param';

const REQUEST = new Request('https://x.co/?foo=bar-123&foo2&foo3=bar3-123');

test('param', () => {
	expect(param('foo', startsWith('bar'), REQUEST)).toBe(true);
	expect(param('foo', endsWith('123'), REQUEST)).toBe(true);
	expect(param('baz', startsWith('foo'), REQUEST)).toBe(false);
});
