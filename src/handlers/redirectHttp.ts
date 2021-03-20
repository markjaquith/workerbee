import isHttps from '../conditions/isHttps';
import redirect from './redirect';
import setHttp from './setHttp';
import { addHandlerIf } from '../logic';

export default () => async ({ addRequestHandler }) => {
	addRequestHandler(addHandlerIf(isHttps(), setHttp(), redirect(301)), {
		immediate: true,
	});
};
