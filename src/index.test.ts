import { header, startsWith } from './index';

const USER_AGENT = 'User-Agent';
const userAgent = header(USER_AGENT);
const headers = new Headers();
headers.set(USER_AGENT, 'Googlebot 1.2');
const MANAGER = {
	current: {
		headers,
	},
};

test('Top level exports', () => {
	expect(userAgent(startsWith('Googlebot'))(MANAGER)).toBe(true);
});
