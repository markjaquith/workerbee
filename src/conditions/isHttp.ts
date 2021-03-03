import { incomplete } from '../utils';

export default incomplete(() => ({ request: { url } }) => {
	return new URL(url).protocol === 'http:';
});
