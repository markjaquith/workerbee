import any from './any.js';

const yes = () => true;
const no = () => false;

test('any', () => {
	expect(any(yes)()).toBe(true);
	expect(any(yes, yes, yes)()).toBe(true);
	expect(any(yes, yes, no)()).toBe(true);
	expect(any()()).toBe(false);
	expect(any(no, yes, yes)()).toBe(true);
	expect(any(no, no, no)()).toBe(false);
});
