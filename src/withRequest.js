import partialRight from 'lodash.partialright';

export default conditional => manager => partialRight(conditional, manager.request);
