export * from './requestHandlers';
export * from './responseHandlers';
import ResponseManager from './ResponseManager';

export function handleFetch(
	requestHandlers = [],
	responseHandlers = []
) {
	(new ResponseManager(requestHandlers, responseHandlers)).handleFetch();
}

export default handleFetch;
