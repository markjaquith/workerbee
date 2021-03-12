import Text from './Text';

test('Text can be created using from()', () => {
	const text = Text.from('FOO');
	expect(text.value).toBe('FOO');
	expect(text.insensitive).toBe(false);
	expect(text.negated).toBe(false);
});

test('Text can be created using .i', () => {
	const text = Text.from('FOO').i;
	expect(text.value).toBe('FOO');
	expect(text.insensitive).toBe(true);
	expect(text.negated).toBe(false);
});

test('Text can be created using .not', () => {
	const text = Text.from('FOO').not;
	expect(text.value).toBe('FOO');
	expect(text.insensitive).toBe(false);
	expect(text.negated).toBe(true);
});

test('Text can be created using .i.not', () => {
	const text = Text.from('FOO').i.not;
	expect(text.value).toBe('FOO');
	expect(text.insensitive).toBe(true);
	expect(text.negated).toBe(true);
});

test('Text can be created using i.not()', () => {
	const text = Text.from('FOO').not.i;
	expect(text.value).toBe('FOO');
	expect(text.insensitive).toBe(true);
	expect(text.negated).toBe(true);
});

test('Text can be created using not.not.i()', () => {
	const text = Text.from('FOO').not.not.i;
	expect(text.value).toBe('FOO');
	expect(text.insensitive).toBe(true);
	expect(text.negated).toBe(false);
});

test('Text can be seamlessly cast to a string', () => {
	const text = Text.from('FOO');
	expect(text.value).toBe('FOO');
	expect(`${text}BAR`).toBe('FOOBAR');
});
