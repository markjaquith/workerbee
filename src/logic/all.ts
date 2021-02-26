export default function all(...conditions) {
	if (!conditions.length) {
		return () => false;
	}

	return (message) => {
		for (const condition of conditions) {
			if (!condition(message)) {
				return false;
			}
		}
		return true;
	};
}
