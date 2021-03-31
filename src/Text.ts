export default class Text {
	private _value: string | undefined
	public insensitive: boolean = false
	public negated: boolean = false

	constructor(value?: string) {
		this._value = value
	}

	static from(input?: string | Text) {
		return input instanceof Text ? input : new Text(input)
	}

	get not() {
		this.negated = !this.negated
		return this
	}

	get i() {
		this.insensitive = true
		return this
	}

	get value() {
		return this._value || ''
	}

	toString() {
		return this.value
	}

	convert(text: string) {
		return this.insensitive ? text.toLowerCase() : text
	}

	matches(
		test: string,
		matcher: (value: string, searchText: string) => boolean,
	) {
		return (
			this.negated !== matcher(this.convert(this.value), this.convert(test))
		)
	}
}
