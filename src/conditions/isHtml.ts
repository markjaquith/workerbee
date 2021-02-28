import contentType from './contentType';
import { incomplete, partial } from '../utils';

export default incomplete(() => partial(contentType, 'text/html'));
