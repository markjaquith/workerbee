import Router from './Router';

export type Handler = (any) => Promise<any>;
export type Handlers = Handler | Handler[];
export type RouterCallback = (router: Router) => void;

export interface Options {
	request?: Handlers;
	response?: Handlers;
	routes?: RouterCallback;
}

export default class interface {
	addRequestHandler: (handler: Handler) => void;
	addResponseHandler: (handler: Handler) => void;
	makeResponse: (event: Event) => Response;
}
