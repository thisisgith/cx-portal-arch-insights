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
 * Possibly additional search contexts
 */
export enum SearchContext {
	serialno = 'serialno',
	contract = 'contract',
}

/**
 * Type returned by determineType in search service
 */
export interface SearchType {
	name: SearchEnum;
	value?: any;
}

/**
 * Represents a query input for any of the special searches/general search
 * Using an object instead of a raw string to force change detection whenever it's reassigned,
 * even if the query value is the same.
 */
export interface SearchQuery {
	query: string;
}
