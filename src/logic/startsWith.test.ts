import startsWith, { iStartsWith } from './startsWith';

const STRING = 'foo string';
const UPPER_STRING = 'FOO STRING';

test('startsWith', () => {
	expect(startsWith('foo')(STRING)).toBe(true);
	expect(startsWith('bar')(STRING)).toBe(false);
	expect(iStartsWith('foo')(UPPER_STRING)).toBe(true);
	expect(iStartsWith('bar')(UPPER_STRING)).toBe(false);
});
