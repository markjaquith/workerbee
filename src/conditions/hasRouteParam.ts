import curry from 'lodash/curry';

export default curry((param, { params }) => params.hasOwnProperty(param));
