import contentTypeMatches from './contentTypeMatches';
import partial from 'lodash/partial';

export default partial(contentTypeMatches, 'text/html');
