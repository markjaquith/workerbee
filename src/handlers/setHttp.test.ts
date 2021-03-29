import RequestManager from '../RequestManager';
import setHttp from './setHttp';

const manager = new RequestManager().makeData({
	request: new Request('https://example.com/'),
});

const HTTP = 'http';

test('setProtocol()', async () => {
	const result = await setHttp()(manager);
	const url = new URL(result.url);
	expect(url.protocol).toBe(`${HTTP}:`);
});
