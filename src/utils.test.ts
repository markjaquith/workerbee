import { isIncomplete, makeComplete, incomplete } from './utils';

const RESULT = 'result';

test('incomplete functions', () => {
	const fn = () => RESULT;
	const incompleteFn = incomplete(() => fn);
	const doubleWrappedIncompleteFn = incomplete(() => incompleteFn);

	expect(isIncomplete(fn)).toBe(false);
	expect(isIncomplete(incompleteFn)).toBe(true);
	expect(isIncomplete(doubleWrappedIncompleteFn)).toBe(true);
	expect(isIncomplete(makeComplete(incompleteFn))).toBe(false);
	expect(isIncomplete(makeComplete(doubleWrappedIncompleteFn))).toBe(false);
	expect(makeComplete(incompleteFn)()).toBe(RESULT);
	expect(makeComplete(doubleWrappedIncompleteFn)()).toBe(RESULT);
});
