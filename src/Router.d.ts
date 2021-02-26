import { Handler } from './RequestManager.d';
import Router from './Router';

export type MethodRegistrar = (pattern: string, ...Handler) => Router;
