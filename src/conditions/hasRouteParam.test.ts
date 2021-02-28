import hasRouteParam from './hasRouteParam';

const MESSAGE = {
	params: {
		foo: 'bar',
		foo2: '',
		foo3: 'bar3',
	},
};

const hasFooParam = hasRouteParam('foo');

test('hasRouteParam', () => {
	expect(hasRouteParam('foo', MESSAGE)).toBe(true);
	expect(hasFooParam(MESSAGE)).toBe(true); // Curried.
	expect(hasRouteParam('foo2', MESSAGE)).toBe(true);
	expect(hasRouteParam('foo3', MESSAGE)).toBe(true);
	expect(hasRouteParam('foo4', MESSAGE)).toBe(false);
});
