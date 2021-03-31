import { matchesValue } from '../utils'
import type { ValueMatcher } from '../utils'

export default function (
	param: string,
	matcher: ValueMatcher,
	{ url }: Request,
) {
	const urlObj = new URL(url)
	const params = urlObj.searchParams
	const paramValue = params.get(param) || false

	return paramValue && matchesValue(matcher, paramValue)
}
