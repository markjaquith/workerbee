import BaseRouter from './BaseRouter'
import { escapeRegExp } from './utils'

const WILDCARD = '::WILDCARD::'

export default class HostRouter extends BaseRouter {
	private hostPattern: string

	constructor(hostPattern: string) {
		super()
		this.hostPattern = hostPattern
	}

	private makeRegex(hostPattern: string): RegExp {
		return new RegExp(
			'^' +
				escapeRegExp(hostPattern.replace('*', WILDCARD)).replace(
					WILDCARD,
					'(.*?)',
				) +
				'$',
		)
	}

	matches(request: Request): boolean {
		const url = new URL(request.url)
		const regex = this.makeRegex(this.hostPattern)

		return regex.test(url.hostname)
	}
}
