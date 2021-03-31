import HTMLRewriter from './HTMLRewriter'

let ElementRemover,
	AttributeSetter,
	CommentRemover,
	CommentReplacer,
	TextReplacer

beforeAll(() => {
	AttributeSetter = class {
		element(element) {
			if (!element.hasAttribute('foo')) {
				element.setAttribute('foo', 'foo')
			} else {
				element.setAttribute('foo', element.getAttribute('foo') + 'bar')
			}
		}
	}

	ElementRemover = class {
		element(element) {
			element.remove()
		}
	}

	CommentRemover = class {
		comments(comment) {
			comment.remove()
		}
	}

	CommentReplacer = class {
		comments(element) {
			element.replace('timid')
		}
	}

	TextReplacer = class {
		text(text) {
			text.replace('Meh')
		}
	}
})

describe('HTMLRewriter', () => {
	test('runs all handlers', async () => {
		const response = new Response(
			'<h1>Headline<!--Headline Comment--></h1><div><p foo="foo"><img src="test.jpg" /><mark>mark</mark></p><b><!--bold--></b></div>',
			{
				headers: new Headers({
					'content-type': 'text/html',
				}),
			},
		)
		const result = await new HTMLRewriter()
			.on('h1', new CommentRemover())
			.on('mark', new ElementRemover())
			.on('p', new AttributeSetter())
			.on('h1', new AttributeSetter())
			.on('b', new CommentReplacer())
			.on('h1', new TextReplacer())
			.transform(response)

		document.body.innerHTML = await result.text()
		expect(document.body.innerHTML).not.toContain('<!--Headline Comment-->')
		expect(document.querySelector('p').getAttribute('foo')).toBe('foobar')
		expect(document.querySelector('h1').getAttribute('foo')).toBe('foo')
		expect(document.body.innerHTML).not.toContain('<!--bold-->')
		expect(document.body.innerHTML).toContain('<!--timid-->')
		expect(document.querySelector('h1').innerHTML).toContain('Meh')
		expect(document.querySelector('h1').innerHTML).not.toContain('Headline')
	})
})
