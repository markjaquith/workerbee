export default class StyleInjector {
	private cssString: string

	constructor(cssString: string) {
		this.cssString = cssString
	}

	element(el: Element) {
		el.append(`<style>${this.cssString}</style>`, { html: true })
	}
}
