import curry from 'lodash.curry';

export default curry(function headerContains(
	headerName,
	searchText,
	{ headers }
) {
	const header = headers.get(headerName) || false;

	return header && header.includes(searchText);
});
