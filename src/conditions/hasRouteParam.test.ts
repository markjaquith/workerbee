import hasRouteParam from './hasRouteParam';

const REQUEST = {
	params: {
		foo: 'bar',
		foo2: '',
		foo3: 'bar3',
	},
};

const hasFooParam = hasRouteParam('foo');

test('hasRouteParam', () => {
	expect(hasRouteParam('foo', REQUEST)).toBe(true);
	expect(hasFooParam(REQUEST)).toBe(true); // Curried.
	expect(hasRouteParam('foo2', REQUEST)).toBe(true);
	expect(hasRouteParam('foo3', REQUEST)).toBe(true);
	expect(hasRouteParam('foo4', REQUEST)).toBe(false);
});
