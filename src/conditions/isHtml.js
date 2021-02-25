import isContentType from './isContentType.js';
import partial from 'lodash/partial';

export default partial(isContentType, 'text/html');
