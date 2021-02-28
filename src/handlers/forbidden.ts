import { incomplete } from '../utils';

export default incomplete(
	(message = 'Sorry, this page is not available.') => async () => {
		return new Response(message, {
			status: 403,
			statusText: 'Forbidden',
		});
	},
);
