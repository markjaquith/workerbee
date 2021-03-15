import lazyLoadImages from './lazyLoadImages';

let response;

beforeAll(() => {
	response = new Response(
		'<img src="test.jpg" /><p src="no.jpg" /><img src="test.gif" />',
		{
			headers: new Headers({
				'Content-Type': 'text/html',
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
});
