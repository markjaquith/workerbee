import { HandlerProcessor } from '../RequestManager';

export default (param: string, { params }: HandlerProcessor) =>
	params.hasOwnProperty(param);
