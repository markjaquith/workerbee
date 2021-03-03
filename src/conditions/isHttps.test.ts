import isHttps from './isHttps';
import isHttp from './isHttp';

const HTTPS = { request: new Request('https://example.com/') };
const HTTP = { request: new Request('http://example.com/') };

test('isHttps', () => {
	expect(isHttps()(HTTPS)).toBe(true);
	expect(isHttps()(HTTP)).toBe(false);
	expect(isHttp()(HTTP)).toBe(true);
	expect(isHttp()(HTTPS)).toBe(false);
});
