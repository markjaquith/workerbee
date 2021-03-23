import { ManagerData } from '../RequestManager';
import { Condition } from '../utils';

export default function all(...conditions: Condition[]) {
	if (!conditions.length) {
		return () => false;
	}

	return (processor: ManagerData) => {
		for (const condition of conditions) {
			if (!condition(processor)) {
				return false;
			}
		}
		return true;
	};
}
