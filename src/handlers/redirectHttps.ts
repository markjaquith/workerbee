import isHttp from '../conditions/isHttp';
import redirect from './redirect';
import setHttps from './setHttps';
import { incomplete } from '../utils';
import { addHandlerIf } from '../logic';

export default incomplete(() => async ({ addRequestHandler }) => {
	addRequestHandler(addHandlerIf(isHttp, setHttps, redirect(301)), {
		immediate: true,
	});
});
