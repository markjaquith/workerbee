export default class AttributeSetter {
	private attr: string
	private value: any

	constructor(attr: string, value: any) {
		this.attr = attr
		this.value = value
	}

	element(element: Element) {
		element.setAttribute(this.attr, this.value)
	}
}
