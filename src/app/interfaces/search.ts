/**
 * Possible types of personal search
 */
export enum SearchEnum {
	case = 'case',
	sn = 'sn',
	rma = 'rma',
	contract = 'contract',
	product = 'product',
	default = 'default',
}

/**
 * Type returned by determineType in search service
 */
export interface SearchType {
	name: SearchEnum;
	value?: any;
}
