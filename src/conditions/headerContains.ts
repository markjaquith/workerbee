import curry from 'lodash/curry';
import headerMatches from './headerMatches';

export default curry(function (headerName, searchText: string) {
	return headerMatches(headerName, (header) => header.includes(searchText));
});
