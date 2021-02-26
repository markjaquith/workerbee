import curry from 'lodash/curry';

export default curry((param, { url }) => new URL(url).searchParams.has(param));
