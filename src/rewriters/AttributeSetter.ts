export default class AttributeSetter {
	private attr: string;
	private value: any;

	constructor(attr, value) {
		this.attr = attr;
		this.value = value;
	}

	element(element) {
		element.setAttribute(this.attr, this.value);
	}
}
