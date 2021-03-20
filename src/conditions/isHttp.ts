export default () => ({ request: { url } }) => {
	return new URL(url).protocol === 'http:';
};
