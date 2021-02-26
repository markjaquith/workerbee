export default function any(...conditions) {
	if (!conditions.length) {
		return () => false;
	}

	return (message) => {
		for (const condition of conditions) {
			if (condition(message)) {
				return true;
			}
		}
		return false;
	};
}
