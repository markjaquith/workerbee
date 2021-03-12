export default class StyleInjector {
	private cssString: string;

	constructor(cssString) {
		this.cssString = cssString;
	}

	element(el) {
		el.append(`<style>${this.cssString}</style>`, { html: true });
	}
}
