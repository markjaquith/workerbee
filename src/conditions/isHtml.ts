import contentType from './contentType';
import partial from 'lodash/partial';
import { incomplete } from '../utils';

export default incomplete(() => partial(contentType, 'text/html'));
