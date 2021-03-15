import lazyLoadImages from './lazyLoadImages';

let response, textResponse;

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
		const result = await lazyLoadImages({ response });
		document.body.innerHTML = await result.text();
		document.querySelectorAll('img').forEach((img) => {
			expect(img.getAttribute('loading')).toBe('lazy');
		});
		expect(document.querySelector('p').getAttribute('loading')).toBeNull();
	});

	test('Ignores responses that are not text/html', async () => {
		const result = await lazyLoadImages({ response: textResponse });
		expect(result).toBeUndefined();
	});
});
