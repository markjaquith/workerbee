export default (param: string, { url }: Request) =>
	new URL(url).searchParams.has(param)
