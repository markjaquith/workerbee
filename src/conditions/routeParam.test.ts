import { contains, startsWith } from '../logic';
import routeParam from './routeParam';

const REQUEST = {
	current: {
		params: {
			foo: 'bar 123',
			foo2: '',
			foo3: 'bar3 123',
		},
	},
};

const fooParamContainsBar = routeParam('foo', contains('bar'));
const fooParamStartsWithBar = routeParam('foo', startsWith('bar'));
const foo2ParamContainsBar = routeParam('foo2', contains('bar'));

test('routeParam', () => {
	expect(fooParamContainsBar(REQUEST)).toBe(true);
	expect(fooParamStartsWithBar(REQUEST)).toBe(true);
	expect(foo2ParamContainsBar(REQUEST)).toBe(false);
});
