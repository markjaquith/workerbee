export default class TimidAttributeSetter {
	private attr: string
	private value: any

	constructor(attr: string, value: any) {
		this.attr = attr
		this.value = value
	}

	element(element: Element) {
		if (!element.hasAttribute(this.attr)) {
			element.setAttribute(this.attr, this.value)
		}
	}
}
