import RequestManager from '../RequestManager'
import lazyLoadImages from './lazyLoadImages'

let response: Response, textResponse: Response

beforeAll(() => {
	response = new Response(
		'<img data-loading="lazy" src="test.jpg" /><p src="no.jpg" /><img data-loading="lazy" src="test.gif" /><img data-loading="eager" loading="eager" src="test.gif" />',
		{
			headers: new Headers({
				'Content-Type': 'text/html',
			}),
		},
	)
	textResponse = new Response(
		'<img src="test.jpg" /><p src="no.jpg" /><img src="test.gif" />',
		{
			headers: new Headers({
				'Content-Type': 'text/plain',
			}),
		},
	)
})

describe('lazyLoadImages()', () => {
	test('Converts images, but not other elements', async () => {
		const result = await lazyLoadImages()(
			new RequestManager().makeData({ response }),
		)
		document.body.innerHTML = await result.text()
		document.querySelectorAll('img[data-loading="lazy"]').forEach((img) => {
			expect(img.getAttribute('loading')).toBe('lazy')
		})
		document.querySelectorAll('img[data-loading="eager"]').forEach((img) => {
			expect(img.getAttribute('loading')).toBe('eager')
		})
		expect(document.querySelector('p').getAttribute('loading')).toBeNull()
	})

	test('Ignores responses that are not text/html', async () => {
		const result = await lazyLoadImages()(
			new RequestManager().makeData({ response: textResponse }),
		)
		expect(result).toBeUndefined()
	})
})
