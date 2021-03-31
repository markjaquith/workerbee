import { contains, startsWith } from '../logic'
import RequestManager from '../RequestManager'
import routeParam from './routeParam'

const request = new Request('https://example.com/')

const managerData = new RequestManager().makeData({
	current: request,
	request,
	params: {
		foo: 'bar 123',
		foo2: '',
		foo3: 'bar3 123',
		foo4: ['one', 'two', 'three'],
	},
})

test('routeParam', () => {
	expect(routeParam('foo', contains('bar'), managerData)).toBe(true)
	expect(routeParam('foo', startsWith('bar'), managerData)).toBe(true)
	expect(routeParam('foo2', contains('bar'), managerData)).toBe(false)
	expect(routeParam('foo4', contains('four'), managerData)).toBe(false)
	expect(routeParam('foo4', contains('two'), managerData)).toBe(true)
	expect(routeParam('foo4', startsWith('thr'), managerData)).toBe(true)
})
