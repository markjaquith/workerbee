import AttributeSetter from './AttributeSetter';

test('AttributeSetter', () => {
	const element = document.createElement('p');
	const attributeSetter = new AttributeSetter('class', 'foo');
	attributeSetter.element(element);

	expect(element.getAttribute('class')).toBe('foo');
});
