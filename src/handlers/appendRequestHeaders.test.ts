import RequestManager from '../RequestManager'
import appendRequestHeaders from './appendRequestHeaders'

const append = appendRequestHeaders({
	bar: 'foo',
	zoo: 'boo',
})
const appendNothing = appendRequestHeaders()

function makeManager(headers: { [header: string]: string }) {
	return new RequestManager().makeData({
		request: new Request('https://example.com/', {
			headers,
		}),
		phase: 'request',
	})
}

describe('appendRequestHeaders()', () => {
	test('appends to existing values', async () => {
		const manager = makeManager({
			bar: 'bar',
			zoo: 'zoo',
			untouched: 'same',
		})
		const result = (await append(manager)) as Request
		expect(result.headers.get('bar')).toBe('bar, foo')
		expect(result.headers.get('zoo')).toBe('zoo, boo')
		expect(result.headers.get('untouched')).toBe('same')
	})

	test('writes new values', async () => {
		const manager = makeManager({
			untouched: 'same',
		})
		const result = (await append(manager)) as Request
		expect(result.headers.get('bar')).toBe('foo')
		expect(result.headers.get('zoo')).toBe('boo')
		expect(result.headers.get('untouched')).toBe('same')
	})

	test('does nothing when nothing passed', async () => {
		const manager = makeManager({
			untouched: 'same',
		})
		const result = await appendNothing(manager)
		expect(result).toBeUndefined()
	})

	test('does nothing when value already in header', async () => {
		const manager = makeManager({
			bar: 'foo',
			zoo: 'boo',
			untouched: 'same',
		})
		const result = await append(manager)
		expect(result).toBeUndefined()
	})
})
