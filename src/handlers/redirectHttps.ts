import isHttp from '../conditions/isHttp';
import redirect from './redirect';
import setHttps from './setHttps';
import { addHandlerIf } from '../logic';
import { HandlerProcessor } from '../RequestManager';

export default () => async ({ addRequestHandler }: HandlerProcessor) => {
	addRequestHandler(addHandlerIf(isHttp(), setHttps(), redirect(301)), {
		immediate: true,
	});
};
