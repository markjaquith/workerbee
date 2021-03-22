import { HandlerProcessor } from '../RequestManager';
import { Condition } from '../utils';

export default function any(...conditions: Condition[]) {
	if (!conditions.length) {
		return () => false;
	}

	return (processor: HandlerProcessor) => {
		for (const condition of conditions) {
			if (condition(processor)) {
				return true;
			}
		}
		return false;
	};
}
