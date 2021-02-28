import { makeStringMethodMatchers } from '../utils';

export const [contains, iContains] = makeStringMethodMatchers('includes');
export default contains;
