import {
	isIncomplete,
	makeComplete,
	incomplete,
	withCurrent,
	curryWithCurrent,
	transformLastArgument,
	matchesValue,
	toArray,
	getCookie,
	withRequest,
	withResponse,
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

describe('withRequest()', () => {
	test('returns request from the last argument called', () => {
		const fn = (_a, b) => b;
		expect(withRequest(fn)('a', { request: 'request' })).toBe('request');
	});
});

describe('withResponse()', () => {
	test('returns response from the last argument called', () => {
		const fn = (_a, b) => b;
		expect(withResponse(fn)('a', { response: 'response' })).toBe('response');
	});
});

test('curryWithCurrent', () => {
	expect(curryWithCurrent(threeArgs)('one', 'two', INPUT)).toBe(CURRENT);
	expect(curryWithCurrent(threeArgs)('one')('two')(INPUT)).toBe(CURRENT);
});

test('transformLastArgument()', () => {
	const makeZ = () => 'z';
	expect(transformLastArgument(makeZ, () => 'result')()).toBe('result');
	expect(transformLastArgument(makeZ, (z) => z)('a')).toBe('z');
	expect(transformLastArgument(makeZ, (_a, z) => z)('a', 'b')).toBe('z');
	expect(transformLastArgument(makeZ, (_a, _b, z) => z)('a', 'b', 'c')).toBe(
		'z',
	);
	expect(
		transformLastArgument(makeZ, (_a, _b, _c, z) => z)('a', 'b', 'c', 'd'),
	).toBe('z');
	expect(
		transformLastArgument(makeZ, (_a, _b, _c, _d, z) => z)(
			'a',
			'b',
			'c',
			'd',
			'e',
		),
	).toBe('z');
	// @ts-ignore
	expect(() =>
		transformLastArgument(makeZ, (_a, _b, _c, _d, _e, z) => z)(
			'a',
			'b',
			'c',
			'd',
			'e',
		),
	).toThrow();
});

test('matchesValue()', () => {
	const startsWithA = (str) => str.startsWith('A');
	const endsWithZ = (str) => str.endsWith('Z');
	expect(matchesValue([startsWithA, endsWithZ], 'ABUZZ')).toBe(true);
	expect(matchesValue([startsWithA, endsWithZ], 'ZEBRA')).toBe(false);
});

test('toArray()', () => {
	expect(toArray([])).to;
	expect(toArray(['foo', 'bar'])).toStrictEqual(['foo', 'bar']);
	expect(toArray({ foo: 'bar' })).toStrictEqual([{ foo: 'bar' }]);
	expect(toArray('foo')).toStrictEqual(['foo']);
	expect(toArray(null)).toStrictEqual([]);
	expect(toArray(undefined)).toStrictEqual([]);
});

test('getCookie()', () => {
	const cookie = 'name=Mark; eyes=blue';
	const headers = new Headers();
	headers.set('cookie', cookie);
	const request = new Request('https://example.com/', {
		method: 'GET',
		headers,
	});

	const requestWithNoCookies = new Request('https://example.com/');

	expect(getCookie(request, 'eyes')).toBe('blue');
	expect(getCookie(request, 'name')).toBe('Mark');
	expect(getCookie(request, 'age')).toBeNull();
	expect(getCookie(requestWithNoCookies, 'name')).toBeNull();
});
