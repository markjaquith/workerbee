import isContentType from './isContentType';
import partial from 'lodash/partial';

export default partial(isContentType, 'text/html');
