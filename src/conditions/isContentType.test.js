import isContentType from './isContentType';
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

test('isContentType', () => {
	expect(isContentType('text/html', makeTypeHeader('text/html; charset=utf-8'))).toBe(true);
	expect(isContentType('text/html', makeTypeHeader('text/plain'))).toBe(false);
	expect(isContentType('text/html', makeTypeHeader())).toBe(false);
	expect(isContentType('text/html')(makeTypeHeader('   text/html   ; charset=utf-8   '))).toBe(true); // Curried.
});

test('isHtml', () => {
	expect(isHtml(makeTypeHeader('text/html; charset=utf-8'))).toBe(true);
	expect(isHtml(makeTypeHeader('text/plain'))).toBe(false);
	expect(isHtml(makeTypeHeader('   text/html   ; charset=utf-8   '))).toBe(true);
});
