import isHttps from '../conditions/isHttps';
import redirect from './redirect';
import setHttp from './setHttp';
import { addHandlerIf } from '../logic';
import { HandlerProcessor } from '../RequestManager';

export default () => async ({ addRequestHandler }: HandlerProcessor) => {
	addRequestHandler(addHandlerIf(isHttps(), setHttp(), redirect(301)), {
		immediate: true,
	});
};
