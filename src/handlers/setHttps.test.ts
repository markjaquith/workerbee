import RequestManager from '../RequestManager';
import setHttps from './setHttps';

const request = new Request('http://example.com/');
const manager = new RequestManager().makeData({
	request,
	current: request,
});

const HTTPS = 'https';

test('setProtocol()', async () => {
	const result = await setHttps()(manager);
	const url = new URL(result.url);
	expect(url.protocol).toBe(`${HTTPS}:`);
});
