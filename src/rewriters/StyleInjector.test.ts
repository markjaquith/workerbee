import StyleInjector from './StyleInjector';

const STYLE = 'div { color: pink; }';

test('StyleInjector', () => {
	const head = {
		append: jest.fn(),
	};

	const styleInjector = new StyleInjector(STYLE);

	styleInjector.element(head);
	expect(head.append).toHaveBeenCalledTimes(1);
	expect(head.append).lastCalledWith(`<style>${STYLE}</style>`, { html: true });
});
