import RequestManager from '../RequestManager';
import lazyLoadImages from './lazyLoadImages';

let response: Response, textResponse: Response;

beforeAll(() => {
	response = new Response(
		'<img src="test.jpg" /><p src="no.jpg" /><img src="test.gif" />',
		{
			headers: new Headers({
				'Content-Type': 'text/html',
			}),
		},
	);
	textResponse = new Response(
		'<img src="test.jpg" /><p src="no.jpg" /><img src="test.gif" />',
		{
			headers: new Headers({
				'Content-Type': 'text/plain',
			}),
		},
	);
});

describe('lazyLoadImages()', () => {
	test('Converts images, but not other elements', async () => {
		const result = await lazyLoadImages()(
			new RequestManager().makeData({ response }),
		);
		document.body.innerHTML = await result.text();
		document.querySelectorAll('img').forEach((img) => {
			expect(img.getAttribute('loading')).toBe('lazy');
		});
		expect(document.querySelector('p').getAttribute('loading')).toBeNull();
	});

	test('Ignores responses that are not text/html', async () => {
		const result = await lazyLoadImages()(
			new RequestManager().makeData({ response: textResponse }),
		);
		expect(result).toBeUndefined();
	});
});
