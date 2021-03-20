import header from './header';
import { all, contains, startsWith, endsWith } from '../logic';
import { partialRight } from '../utils';

const message = new Request('https://example.com/', {
	headers: {
		foo: 'contains bar in the middle',
	},
});

const applyHeader = partialRight(header, [message]);

test('headers are matched', () => {
	expect(applyHeader('foo', contains('bar'))).toBe(true);
	expect(applyHeader('foo', contains('baz'))).toBe(false);
	expect(applyHeader('bar', contains('bar'))).toBe(false);
});

test('complex headers are matched', () => {
	expect(applyHeader('foo', startsWith('contains'))).toBe(true);
	expect(
		applyHeader(
			'foo',
			all(
				startsWith('contains bar'),
				startsWith('contains'),
				startsWith('c'),
				endsWith('middle'),
			),
		),
	).toBe(true);
});
