export default class AttributeSetter {
	constructor(attr, value) {
		this.attr = attr;
		this.value = value;
	}

	element(element) {
		element.setAttribute(this.attr, this.value);
	}
}
