import curry from 'lodash.curry';

export default curry(function pathStartsWith(startsWith, { request }) {
	const url = new URL(request.url);
	return url.pathname.startsWith(startsWith);
});
