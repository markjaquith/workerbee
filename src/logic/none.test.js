import none from './none.js';

const yes = () => true;
const no = () => false;

test('none', () => {
	expect(none(yes)()).toBe(false);
	expect(none(yes, yes, yes)()).toBe(false);
	expect(none(yes, yes, no)()).toBe(false);
	expect(none()()).toBe(true);
	expect(none(no, yes, yes)()).toBe(false);
	expect(none(no, no, no)()).toBe(true);
	expect(none(no)()).toBe(true);
});
