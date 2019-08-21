import { SoftwareList } from './syslog360filtersoftwarelist-data';
import { ProductFamily } from './syslog360filterproductfamily-data';
import { ProductId } from './syslog360filterproductID-data';

/** Grid Data Intereface
 */
export interface Syslog360FilterData {
	message?: string;
	responseData?: ResponseData[];
}

/** Grid Data Intereface
 */
export interface ResponseData {
	SoftwareType: SoftwareList[];
	ProductFamily: ProductFamily[];
	ProductId: ProductId[];
}
