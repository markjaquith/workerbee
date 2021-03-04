import {
	isIncomplete,
	makeComplete,
	incomplete,
	withCurrent,
	curryWithCurrent,
} from './utils';

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

const CURRENT = 'current';
const INPUT = {
	current: CURRENT,
};

function inOut(input) {
	return input;
}

function threeArgs(_one, _two, input) {
	return input;
}

test('withCurrent', () => {
	expect(inOut(INPUT)).not.toBe(CURRENT);
	expect(threeArgs('one', 'two', INPUT)).not.toBe(CURRENT);
	expect(withCurrent(inOut)(INPUT)).toBe(CURRENT);
	expect(withCurrent(threeArgs)('one', 'two', INPUT)).toBe(CURRENT);
});

test('curryWithCurrent', () => {
	expect(curryWithCurrent(threeArgs)('one', 'two', INPUT)).toBe(CURRENT);
	expect(curryWithCurrent(threeArgs)('one')('two')(INPUT)).toBe(CURRENT);
});
