import forbidden from './forbidden'

describe('forbidden()', () => {
	test('returns 403 and default message', async () => {
		const response = await forbidden()()
		expect(response).toBeInstanceOf(Response)
		expect(response.status).toBe(403)
		expect(await response.text()).toBe('Sorry, this page is not available.')
	})

	test('returns 403 and custom message', async () => {
		const response = await forbidden('Go away')()
		expect(response).toBeInstanceOf(Response)
		expect(response.status).toBe(403)
		expect(await response.text()).toBe('Go away')
	})
})
