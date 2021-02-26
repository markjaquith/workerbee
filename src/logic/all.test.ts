import all from './all';

const yes = () => true;
const no = () => false;

test('all', () => {
	expect(all(yes)()).toBe(true);
	expect(all(yes, yes, yes)()).toBe(true);
	expect(all(yes, yes, no)()).toBe(false);
	expect(all()()).toBe(false);
	expect(all(no, yes, yes)()).toBe(false);
	expect(all(no, no, no)()).toBe(false);
});
