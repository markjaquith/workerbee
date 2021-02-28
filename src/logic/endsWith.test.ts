import endsWith from './endsWith';

const STRING = 'string with foo';

test('endsWith', () => {
	expect(endsWith('foo')(STRING)).toBe(true);
	expect(endsWith('bar')(STRING)).toBe(false);
});
