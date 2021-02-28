export default (param, { url }) => new URL(url).searchParams.has(param);
