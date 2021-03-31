import isHttps from '../conditions/isHttps'
import redirect from './redirect'
import setHttp from './setHttp'
import { addHandlerIf } from '../logic'
import { ManagerData } from '../RequestManager'

export default () => async ({ addRequestHandler }: ManagerData) => {
	addRequestHandler(addHandlerIf(isHttps(), setHttp(), redirect(301)), {
		immediate: true,
	})
}
