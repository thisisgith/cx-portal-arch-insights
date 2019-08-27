import { SoftwareList } from './syslogpanelfiltersoftwarelist-data';
import { ProductFamily } from './syslogpanelfilterproductfamily-data';
import { ProductId } from './syslogpanelfilterproductID-data';

/** Grid Data Intereface
 */
export interface SyslogPanelFilterData {
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
