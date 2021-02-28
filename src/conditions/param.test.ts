import { endsWith, startsWith } from '../logic';
import param from './param';

const REQUEST = {
	current: {
		url: new URL('https://x.co/?foo=bar-123&foo2&foo3=bar3-123'),
	},
};

const fooParamStartsWithBar = param('foo', startsWith('bar'));
const fooParamEndsWith123 = param('foo', endsWith('123'));
const bazParamStartsWithFoo = param('baz', startsWith('foo'));

test('param', () => {
	expect(fooParamStartsWithBar(REQUEST)).toBe(true);
	expect(fooParamEndsWith123(REQUEST)).toBe(true);
	expect(bazParamStartsWithFoo(REQUEST)).toBe(false);
});
