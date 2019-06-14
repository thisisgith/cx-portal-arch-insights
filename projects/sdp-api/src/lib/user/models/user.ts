/* tslint:disable */
export interface User {

  /**
   * This is the party identifier used throughout the system
   */
  customerId?: string;

  /**
   * This is the party identifier assigned by the profiling system
   */
  genId?: string;

  /**
   * The domain name under which the Smart Account is registered
   */
  domainName?: string;
  individual?: {name?: string, familyName?: string, middleName?: string, email?: string, phoneNumber?: string, ccoId?: string, role?: string, tags?: Array<{tagName?: string, tagValue?: string}>};
}
