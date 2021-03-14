import forbidden from './forbidden';

test('forbidden', async () => {
	const response = await forbidden('Go away')();
	expect(response).toBeInstanceOf(Response);
	expect(response.status).toBe(403);
	expect(await response.text()).toBe('Go away');
});
