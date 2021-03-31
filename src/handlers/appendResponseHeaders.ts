import { ManagerData } from '../RequestManager'
import type { Headers } from './setResponseHeaders'
import { delayUntilResponsePhase } from '../utils'

export default function appendResponseHeaders(headers: Headers = []) {
	const handler = async function ({ response }: ManagerData) {
		let newResponse

		if (!Array.isArray(headers)) {
			headers = Object.entries(headers)
		}

		for (const [key, value] of headers) {
			const values = response.headers.get(key) as string
			const includesValueAlready =
				values &&
				values
					.split(',')
					.map((v) => v.trim())
					.includes(value)
			if (!values || !includesValueAlready) {
				newResponse = newResponse || new Response(response.body, response)
				newResponse.headers.append(key, value)
			}
		}

		if (newResponse) {
			return newResponse
		}
	}

	return delayUntilResponsePhase(handler)
}
