import matchesContentType from './matchesContentType';
import isHtml from './isHtml';

function makeTypeHeader(type = null) {
	const request = {
		headers: new Headers(),
	};

	if (type) {
		request.headers.set('content-type', type);
	}

	return request;
}

test('matchesContentType', () => {
	expect(
		matchesContentType('text/html', makeTypeHeader('text/html; charset=utf-8'))
	).toBe(true);
	expect(matchesContentType('text/html', makeTypeHeader('text/plain'))).toBe(false);
	expect(matchesContentType('text/html', makeTypeHeader())).toBe(false);
	expect(
		matchesContentType('text/html')(
			makeTypeHeader('   text/html   ; charset=utf-8   ')
		)
	).toBe(true); // Curried.
	expect(
		matchesContentType((type) => type.startsWith('text/'))(
			makeTypeHeader('text/foo')
		)
	).toBe(true);
	expect(
		matchesContentType((type) => type.startsWith('text/'))(
			makeTypeHeader('application/foo')
		)
	).toBe(false);
});

test('isHtml', () => {
	expect(isHtml(makeTypeHeader('text/html; charset=utf-8'))).toBe(true);
	expect(isHtml(makeTypeHeader('text/plain'))).toBe(false);
	expect(isHtml(makeTypeHeader('   text/html   ; charset=utf-8   '))).toBe(
		true
	);
});
