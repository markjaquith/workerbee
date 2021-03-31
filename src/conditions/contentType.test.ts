import contentType from './contentType'
import isHtml from './isHtml'

function makeTypeHeader(type = null) {
	const message = {
		headers: new Headers(),
	}

	if (type) {
		message.headers.set('content-type', type)
	}

	return message
}

test('contentType', () => {
	expect(
		contentType('text/html', makeTypeHeader('text/html; charset=utf-8')),
	).toBe(true)
	expect(contentType('text/html', makeTypeHeader('text/plain'))).toBe(false)
	expect(contentType('text/html', makeTypeHeader())).toBe(false)
	expect(
		contentType(
			'text/html',
			makeTypeHeader('   text/html   ; charset=utf-8   '),
		),
	).toBe(true)
	expect(
		contentType((type) => type.startsWith('text/'), makeTypeHeader('text/foo')),
	).toBe(true)
	expect(
		contentType(
			(type) => type.startsWith('text/'),
			makeTypeHeader('application/foo'),
		),
	).toBe(false)
})

test('isHtml()', () => {
	expect(isHtml()(makeTypeHeader('text/html; charset=utf-8'))).toBe(true)
	expect(isHtml()(makeTypeHeader('text/plain'))).toBe(false)
	expect(isHtml()(makeTypeHeader('   text/html   ; charset=utf-8   '))).toBe(
		true,
	)
})
