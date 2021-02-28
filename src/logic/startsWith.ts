import { makeStringMethodMatchers } from '../utils';

export const [startsWith, iStartsWith] = makeStringMethodMatchers('startsWith');
export default startsWith;
