import { ManagerData } from '../RequestManager';
import { Condition } from '../utils';

export default function none(...conditions: Condition[]) {
	return (processor: ManagerData) => {
		for (const condition of conditions) {
			if (condition(processor)) {
				return false;
			}
		}
		return true;
	};
}
