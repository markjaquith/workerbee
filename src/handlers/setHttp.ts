import { incomplete, partial } from '../utils';
import setProtocol from './setProtocol';

export default incomplete(partial(setProtocol, 'http'));
