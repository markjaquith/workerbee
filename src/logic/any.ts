import { ManagerData } from '../RequestManager'
import { Condition } from '../utils'

export default function any(...conditions: Condition[]) {
	if (!conditions.length) {
		return () => false
	}

	return (processor: ManagerData) => {
		for (const condition of conditions) {
			if (condition(processor)) {
				return true
			}
		}
		return false
	}
}
