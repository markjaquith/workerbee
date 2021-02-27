import matchesContentType from './matchesContentType';
import partial from 'lodash/partial';

export default partial(matchesContentType, 'text/html');
