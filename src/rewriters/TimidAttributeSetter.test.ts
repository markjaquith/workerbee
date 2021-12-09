import TimidAttributeSetter from './TimidAttributeSetter'

test('TimidAttributeSetter', () => {
	const element = document.createElement('p')
	element.setAttribute('class', 'stubborn')
	const attributeSetter = new TimidAttributeSetter('class', 'foo')
	attributeSetter.element(element)

	expect(element.getAttribute('class')).toBe('stubborn')
})
