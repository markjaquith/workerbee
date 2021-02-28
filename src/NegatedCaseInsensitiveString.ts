export default class NegatedCaseInsensitiveString {
	public value: string;

	constructor(value) {
		this.value = value.toLowerCase();
	}
}
