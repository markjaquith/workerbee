import { makeComplete } from '../utils';
import setHttps from './setHttps';

const REQUEST = {
	request: new Request('http://example.com/'),
};

const HTTPS = 'https';

test('setProtocol()', async () => {
	const result = await makeComplete(setHttps)(REQUEST);
	const url = new URL(result.url);
	expect(url.protocol).toBe(`${HTTPS}:`);
});
