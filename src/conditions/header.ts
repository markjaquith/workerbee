import { matchesValue } from '../utils'
import type { ValueMatcher } from '../utils'

export default function (
	headerName: string,
	matcher: ValueMatcher,
	{ headers }: Request | Response,
) {
	const header = headers.get(headerName) || false

	return header && matchesValue(matcher, header)
}
