import { partialRight } from 'lodash';
import { contains, startsWith } from '../logic';
import routeParam from './routeParam';

const MESSAGE = {
	params: {
		foo: 'bar 123',
		foo2: '',
		foo3: 'bar3 123',
	},
};

const applyRouteParam = partialRight(routeParam, MESSAGE);

test('routeParam', () => {
	expect(applyRouteParam('foo', contains('bar'))).toBe(true);
	expect(applyRouteParam('foo', startsWith('bar'))).toBe(true);
	expect(applyRouteParam('foo2', contains('bar'))).toBe(false);
});
