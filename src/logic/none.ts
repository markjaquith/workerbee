import { HandlerProcessor } from '../RequestManager';
import { Condition } from '../utils';

export default function none(...conditions: Condition[]) {
	return (processor: HandlerProcessor) => {
		for (const condition of conditions) {
			if (condition(processor)) {
				return false;
			}
		}
		return true;
	};
}
