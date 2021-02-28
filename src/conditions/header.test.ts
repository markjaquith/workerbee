import header from './header';
import { all, contains, startsWith, endsWith } from '../logic';

const fooHeaderContainsBar = header('foo', contains('bar'));
const fooHeaderContainsBaz = header('foo', contains('baz'));
const barHeaderContainsBar = header('bar', contains('bar'));
const fooHeaderStartsWithContains = header('foo', startsWith('contains'));

const current = new Request('https://example.com/', {
	headers: new Headers({
		foo: 'contains bar in the middle',
	}),
});

test('headers are matched', () => {
	expect(fooHeaderContainsBar({ current })).toBe(true);
	expect(fooHeaderContainsBaz({ current })).toBe(false);
	expect(barHeaderContainsBar({ current })).toBe(false);
	expect(fooHeaderStartsWithContains({ current })).toBe(true);
	expect(
		header(
			'foo',
			all(
				startsWith('contains bar'),
				startsWith('contains'),
				startsWith('c'),
				endsWith('middle'),
			),
		)({ current }),
	).toBe(true);
	expect(
		all(
			header('foo', startsWith('contains bar')),
			header('foo', endsWith('middle')),
		)({ current }),
	).toBe(true);
});
