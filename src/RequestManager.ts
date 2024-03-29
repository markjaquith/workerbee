import { Router } from './Router'
import { toArray, isRedirect, testing } from './utils'
import type { Params } from './Router'

export type HandlerResult = void | Request | Response

export type Handler = (manager: ManagerData) => void | Promise<HandlerResult>

export type Handlers = Handler | Handler[]

export type RouterCallback = (router: Router) => void

interface FinalRequestOptions {
	request: Request
	params: Params
}

interface FinalResponseOptions {
	request: Request
	response: Response
	originalRequest: Request
	params: Params
}

export interface Options {
	request?: Handlers
	response?: Handlers
	routes?: RouterCallback
}

export interface AddHandlerOptions {
	immediate?: boolean
}

export type HandlerAdder = (
	handler: Handler,
	options?: AddHandlerOptions,
) => void

export type CfPropertiesHandler = (
	cf: RequestInitCfProperties,
) => RequestInitCfProperties | Promise<RequestInitCfProperties>
export type CfPropertiesHandlerAdder = (handler: CfPropertiesHandler) => void

export interface ManagerData {
	addRequestHandler: HandlerAdder
	addResponseHandler: HandlerAdder
	addCfPropertiesHandler: CfPropertiesHandlerAdder
	setRedirectMode: (mode: RequestRedirect) => void
	log: (message?: any, ...optionalParams: any[]) => void
	request: Request
	current: Request | Response
	response: Response
	originalRequest: Request
	params: Params
	phase: 'request' | 'response'
}

export default class RequestManager {
	private requestHandlers: Handler[] = []
	private responseHandlers: Handler[] = []
	private cfPropertiesHandlers: CfPropertiesHandler[] = []
	private redirectMode: RequestRedirect = 'manual'
	private originalRequestHandlers: Handler[]
	private originalResponseHandlers: Handler[]
	private routes: RouterCallback | undefined
	public testing = testing()

	constructor(options: Options = {}) {
		options = {
			request: [],
			response: [],
			...options,
		}

		this.routes = options.routes
		this.originalRequestHandlers = toArray(options.request)
		this.originalResponseHandlers = toArray(options.response)
		this.makeResponse = this.makeResponse.bind(this)
		this.addRequestHandler = this.addRequestHandler.bind(this)
		this.addResponseHandler = this.addResponseHandler.bind(this)
		this.addCfPropertiesHandler = this.addCfPropertiesHandler.bind(this)
		this.setRedirectMode = this.setRedirectMode.bind(this)
		this.log = this.log.bind(this)
	}

	makeData(data: Partial<ManagerData>): ManagerData {
		const request = new Request('')
		const response = new Response()
		const defaults: ManagerData = {
			addRequestHandler: this.addRequestHandler,
			addResponseHandler: this.addResponseHandler,
			addCfPropertiesHandler: this.addCfPropertiesHandler,
			setRedirectMode: this.setRedirectMode,
			log: this.log,
			phase: 'request',
			request: request,
			response: response,
			current: request,
			originalRequest: request,
			params: {},
		}

		const result: ManagerData = {
			...defaults,
			...data,
		}

		return {
			...result,
			addRequestHandler:
				result[
					'response' === result.phase
						? 'addResponseHandler'
						: 'addRequestHandler'
				],
		}
	}

	addRequestHandler(
		handler: Handler,
		options: AddHandlerOptions = { immediate: false },
	) {
		if (options.immediate) {
			this.requestHandlers.unshift(handler)
		} else {
			this.requestHandlers.push(handler)
		}
	}

	addResponseHandler(
		handler: Handler,
		options: AddHandlerOptions = { immediate: false },
	) {
		if (options.immediate) {
			this.responseHandlers.unshift(handler)
		} else {
			this.responseHandlers.push(handler)
		}
	}

	addCfPropertiesHandler(handler: CfPropertiesHandler) {
		this.cfPropertiesHandlers.push(handler)
	}

	setRedirectMode(mode: RequestRedirect) {
		this.redirectMode = mode
	}

	log(message?: any, ...optionalParams: any[]) {
		if (!this.testing) {
			console.log(message, ...optionalParams)
		}
	}

	error(message?: any, ...optionalParams: any[]) {
		console.error(message, ...optionalParams)
	}

	group(...label: any[]) {
		if (!this.testing) {
			console.group(...label)
		}
	}

	groupEnd() {
		if (!this.testing) {
			console.groupEnd()
		}
	}

	async getFinalRequest({
		request,
		params,
	}: FinalRequestOptions): Promise<[Request, Response | null]> {
		const originalRequest = request

		// Response starts null.
		let response: Response | null = null

		// Loop through request handlers.
		while (this.requestHandlers.length > 0 && !response) {
			let requestHandler = this.requestHandlers.shift()!

			const result = await requestHandler(
				this.makeData({
					request,
					current: request,
					originalRequest,
					params,
					phase: 'request',
				}),
			)

			if (result instanceof Response) {
				// Request handlers can bail early and return a response.
				// This skips the rest of the response handlers.
				response = result

				if (isRedirect(response)) {
					this.log(
						`[Early Redirect] ${response.status} ${response.headers.get(
							'location',
						)}`,
					)
				} else {
					this.log(`[Early Response] ${response.status}`)
				}
				break
			} else if (result instanceof Request) {
				// A new Request was returned.
				if (result.url !== request.url) {
					// The request URL changed.
					this.log(`[Edited URL] ${result.url}`)
				}

				// We have a new request to pass to the next handler.
				request = result
			} else if (typeof result !== 'undefined') {
				this.error(
					'Your handler returned something other than a Request, a Response, or undefined',
					result,
				)
			}
		}

		return [request, response]
	}

	async fetch(request: Request) {
		let cfProperties = {}
		while (this.cfPropertiesHandlers.length > 0) {
			const cfPropertiesHandler = this.cfPropertiesHandlers.shift()!
			cfProperties = await cfPropertiesHandler(cfProperties)
		}

		const hasCfProperties = Object.keys(cfProperties).length > 0
		if (hasCfProperties) {
			this.log(
				'ℹ️',
				'Using cf RequestInit properties, which prevents APO from working',
				cfProperties,
			)
		}

		this.log(`[Upstream Request] ${request.url}`)
		const response = await fetch(request, {
			...(hasCfProperties ? { cf: cfProperties } : {}),
			redirect: this.redirectMode,
		})
		this.log(`[Upstream Response] ${response.status}`)
		return response
	}

	async getFinalResponse({
		request,
		response,
		originalRequest,
		params,
	}: FinalResponseOptions) {
		// If there are response handlers, loop through them.
		while (this.responseHandlers.length > 0) {
			const responseHandler = this.responseHandlers.shift()!

			const result = await responseHandler(
				this.makeData({
					request,
					response,
					current: response,
					originalRequest,
					phase: 'response',
					params,
				}),
			)

			// If we receive a result, replace the response.
			if (result instanceof Response) {
				response = result
			} else if (result instanceof Request) {
				this.error(
					'Unexpectedly received a Request back from a Response handler',
					result,
				)
			}
		}

		return response
	}

	async makeResponse(event: FetchEvent) {
		const { request } = event

		this.group(request.url)
		this.log(`[Request] ${request.method} ${request.url}`)

		// Determine the route.
		let routeRequestHandlers: Handler[] = []
		let routeResponseHandlers: Handler[] = []
		let params = {}

		if (this.routes) {
			const router = new Router()
			this.routes(router)
			const route = router.getRoute(request) || router.getNullRoute(request)
			routeRequestHandlers = toArray(route.handlers.request)
			routeResponseHandlers = toArray(route.handlers.response)
			params = route.params
		}

		this.requestHandlers = [
			...this.originalRequestHandlers,
			...routeRequestHandlers,
		]
		this.responseHandlers = [
			...this.originalResponseHandlers,
			...routeResponseHandlers,
		]
		const originalRequest = request

		const [finalRequest, earlyResponse] = await this.getFinalRequest({
			request,
			params,
		})
		const response = earlyResponse ?? (await this.fetch(finalRequest))
		const finalResponse = await this.getFinalResponse({
			response,
			request,
			originalRequest,
			params,
		})

		if (isRedirect(finalResponse)) {
			this.log(
				`[Redirect] ${finalResponse.status} ${finalResponse.headers.get(
					'location',
				)}`,
			)
		} else {
			this.log(`[Response] ${finalResponse.status}`)
		}

		this.groupEnd()

		return finalResponse
	}
}
