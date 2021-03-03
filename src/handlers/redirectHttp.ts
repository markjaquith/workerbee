import isHttps from '../conditions/isHttp';
import redirect from './redirect';
import setHttp from './setHttps';
import { incomplete } from '../utils';
import { addHandlerIf } from '../logic';

export default incomplete(() => async ({ addRequestHandler }) => {
	addRequestHandler(addHandlerIf(isHttps, setHttp, redirect(301)), {
		immediate: true,
	});
});
