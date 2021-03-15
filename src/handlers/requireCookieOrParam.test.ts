import requireCookieOrParam from './requireCookieOrParam';

let tests,
	url,
	anonymousRequest,
	requestWithCookie,
	requestWithParam,
	passwordProtected,
	passwordProtectedCustomMessage;

beforeAll(() => {
	url = 'https://example.com/';
	anonymousRequest = new Request(url);
	requestWithCookie = new Request(url, {
		headers: new Headers({
			cookie: 'anotherOne=foo; letmein=1; foo=bar',
		}),
	});
	requestWithParam = new Request(url + '?letmein');
	passwordProtected = requireCookieOrParam('letmein');
	passwordProtectedCustomMessage = requireCookieOrParam('letmein', 'Buzz off!');
	tests = [passwordProtected, passwordProtectedCustomMessage];
});

describe('requireCookieOrParam()', () => {
	test('anonymous requests are blocked', async () => {
		let result = await passwordProtected({ request: anonymousRequest });
		expect(result).toBeInstanceOf(Response);
		expect(result.status).toBe(403);
		expect(await result.text()).toBe('Access denied');

		result = await passwordProtectedCustomMessage({
			request: anonymousRequest,
		});
		expect(result).toBeInstanceOf(Response);
		expect(result.status).toBe(403);
		expect(await result.text()).toBe('Buzz off!');
	});

	test('cookied requests pass through', async () => {
		tests.forEach(async (block) => {
			let result = await block({ request: requestWithCookie });
			expect(result).toBeUndefined();
		});
	});

	test('requests with the parameter get redirected and cookie set', async () => {
		tests.forEach(async (block) => {
			let result = await block({ request: requestWithParam });
			expect(result).toBeInstanceOf(Response);
			expect(result.status).toBe(302);
			expect(result.headers.get('location')).toBe(url);
			expect(result.headers.get('set-cookie')).toBe(
				'letmein=1; Path=/; HttpOnly',
			);
		});
	});
});
