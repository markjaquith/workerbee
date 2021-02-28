import startsWith from './startsWith';
import { i, not } from '../utils';

const STRING = 'foo string';
const UPPER_STRING = 'FOO STRING';

test('startsWith', () => {
	expect(startsWith('foo')(STRING)).toBe(true);
	expect(startsWith('bar')(STRING)).toBe(false);
	expect(startsWith(i('foo'))(UPPER_STRING)).toBe(true);
	expect(startsWith(i('bar'))(UPPER_STRING)).toBe(false);
	expect(startsWith(not('foo'))(UPPER_STRING)).toBe(true);
	expect(startsWith(not(i('foo')))(UPPER_STRING)).toBe(false);
	expect(startsWith(i(not('foo')))(UPPER_STRING)).toBe(false);
	expect(startsWith(not(i('bar')))(UPPER_STRING)).toBe(true);
	expect(startsWith(i(not('bar')))(UPPER_STRING)).toBe(true);
});
