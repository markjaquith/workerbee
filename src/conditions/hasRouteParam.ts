import { ManagerData } from '../RequestManager'

export default (param: string, { params }: ManagerData) =>
	params.hasOwnProperty(param)
