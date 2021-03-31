import startsWith from './startsWith'

const STRING = 'foo string'

test('startsWith', () => {
	expect(startsWith('foo')(STRING)).toBe(true)
	expect(startsWith('bar')(STRING)).toBe(false)
})
