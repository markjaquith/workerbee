import StyleInjector from './StyleInjector'
import HTMLRewriter from '../HTMLRewriter'

let style, response, handler

beforeAll(() => {
	response = new Response('<div></div><p>Pink</p>', {
		headers: new Headers({
			'Content-Type': 'text/html',
		}),
	})

	style = 'p { color: pink; }'

	const pinkInjector = new StyleInjector(style)

	handler = async ({ response }) => {
		return new HTMLRewriter().on('div', pinkInjector).transform(response)
	}
})

describe('StyleInjector', () => {
	test('Injects styles', async () => {
		const result = await handler({ response })
		document.body.innerHTML = await result.text()
		const div = document.body.querySelector('div')
		expect(div.firstElementChild).toBeInstanceOf(HTMLStyleElement)
		expect((div.firstElementChild as HTMLStyleElement).innerHTML).toBe(style)
	})
})
