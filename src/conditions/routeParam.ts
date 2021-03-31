import { ManagerData } from '../RequestManager'
import { matchesValue, ValueMatcher } from '../utils'

export default function (
	param: string,
	matcher: ValueMatcher,
	{ params }: ManagerData,
) {
	const paramValue = params[param] || false

	// If we got a single param, run the comparison on that.
	if (!Array.isArray(paramValue)) {
		return paramValue && matchesValue(matcher, paramValue)
	}

	for (const eachParamValue of paramValue) {
		const result = eachParamValue && matchesValue(matcher, eachParamValue)
		if (result) {
			return result
		}
	}

	return false
}
