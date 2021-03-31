import { partialRight } from '../utils'
import hasRouteParam from './hasRouteParam'

const MESSAGE = {
	params: {
		foo: 'bar',
		foo2: '',
		foo3: 'bar3',
	},
}

const applyHasRouteParam = partialRight(hasRouteParam, [MESSAGE])

test('hasRouteParam', () => {
	expect(applyHasRouteParam('foo')).toBe(true)
	expect(applyHasRouteParam('foo2')).toBe(true)
	expect(applyHasRouteParam('foo3')).toBe(true)
	expect(applyHasRouteParam('foo4')).toBe(false)
})
