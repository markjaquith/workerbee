export default function none(...conditions) {
	return (message) => {
		for (const condition of conditions) {
			if (condition(message)) {
				return false;
			}
		}
		return true;
	};
}
