import { makeStringMethodMatchers } from '../utils';

export const [endsWith, iEndsWith] = makeStringMethodMatchers('endsWith');
export default endsWith;
