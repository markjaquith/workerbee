import headerContains from './headerContains';
import withRequest from './withRequest';
import applyHandlersIf from './applyHandlersIf';
import partial from 'lodash.partial';

// TODO: This could probably be cleaner.
export default (...args) => _manager => partial(applyHandlersIf, withRequest(headerContains)(...args));
