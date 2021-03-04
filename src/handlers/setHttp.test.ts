import { makeComplete } from '../utils';
import setHttp from './setHttp';

const REQUEST = {
	request: new Request('https://example.com/'),
};

const HTTP = 'http';

test('setProtocol()', async () => {
	const result = await makeComplete(setHttp)(REQUEST);
	const url = new URL(result.url);
	expect(url.protocol).toBe(`${HTTP}:`);
});
