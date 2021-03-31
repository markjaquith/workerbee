import Text from './Text'

test('New Text represents an empty string', () => {
	const text = new Text()
	expect(text.toString()).toBe('')
	expect(`${text}`).toBe('')
	expect(text.convert('')).toBe('')
})

test('Text can be created using from(string)', () => {
	const text = Text.from('FOO')
	expect(text.value).toBe('FOO')
	expect(text.insensitive).toBe(false)
	expect(text.negated).toBe(false)
})

test('Text can be created using from(Text)', () => {
	const text = Text.from(Text.from('FOO'))
	expect(text.value).toBe('FOO')
	expect(text.insensitive).toBe(false)
	expect(text.negated).toBe(false)
})

test('Text can be created using .i', () => {
	const text = Text.from('FOO').i
	expect(text.value).toBe('FOO')
	expect(text.insensitive).toBe(true)
	expect(text.negated).toBe(false)
})

test('Text can be created using .not', () => {
	const text = Text.from('FOO').not
	expect(text.value).toBe('FOO')
	expect(text.insensitive).toBe(false)
	expect(text.negated).toBe(true)
})

test('Text can be created using .i.not', () => {
	const text = Text.from('FOO').i.not
	expect(text.value).toBe('FOO')
	expect(text.insensitive).toBe(true)
	expect(text.negated).toBe(true)
})

test('Text can be created using i.not()', () => {
	const text = Text.from('FOO').not.i
	expect(text.value).toBe('FOO')
	expect(text.insensitive).toBe(true)
	expect(text.negated).toBe(true)
})

test('Text can be created using not.not.i()', () => {
	const text = Text.from('FOO').not.not.i
	expect(text.value).toBe('FOO')
	expect(text.insensitive).toBe(true)
	expect(text.negated).toBe(false)
})

test('Text can be seamlessly cast to a string', () => {
	const text = Text.from('FOO')
	expect(text.value).toBe('FOO')
	expect(`${text}BAR`).toBe('FOOBAR')
})

test('Text can be matched', () => {
	const text = Text.from('FOO').i
	const matcher = (a: string, b: string) => a === b
	expect(text.matches('foo', matcher))
})
