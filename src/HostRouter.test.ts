import HostRouter from './HostRouter';

const exampleDotComRouter = new HostRouter('example.com');

describe('HostRouter', () => {
	test('matches example.com', () => {
		expect(
			exampleDotComRouter.matches(new Request('https://example.com/foo')),
		).toBe(true);
		expect(
			exampleDotComRouter.matches(new Request('https://markjaquith.com/foo')),
		).toBe(false);
	});
});
