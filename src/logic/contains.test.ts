import contains from './contains';

const STRING = 'string with foo';

test('contains', () => {
	expect(contains('foo')(STRING)).toBe(true);
	expect(contains('bar')(STRING)).toBe(false);
});
