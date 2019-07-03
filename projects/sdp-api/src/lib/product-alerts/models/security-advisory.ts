/* tslint:disable */
export interface SecurityAdvisory {

  /**
   * This refers to the OS running on the managed network element. For example:- IOS, IOS-XE, NxOS
   */
  swType?: string;

  /**
   * Unique identifier of a Cisco customer
   */
  customerId?: string;

  /**
   * The unique, generated ID of the network element
   */
  neInstanceId?: string;

  /**
   * The unique identifier for hardware entry in a datastore
   */
  hwInstanceId?: string;

  /**
   * The vendor-specific model name identifier string associated with this physical component
   */
  productId?: string;

  /**
   * The name of a group of products derived from a common product platform
   */
  productFamily?: string;

  /**
   * An indication of the general hardware type of the physical entity (e.g. CHASSIS, MODULE, POWER SUPPLY, POWERSUPPLY, FAN, IPPHONE, OTHER)
   */
  equipmentType?: string;

  /**
   * The unique, generated ID of the network resource id
   */
  managedNeId?: string;

  /**
   * The version of the softwareType running on the managed NE
   */
  swVersion?: string;

  /**
   * Internally generated ID for a security advisory
   */
  advisoryId?: number;

  /**
   * The Cisco.com Title/Headline for the bulletin
   */
  bulletinName?: string;

  /**
   * The vulnerability status of a Network element. Example:- Vulnerable, Potentially Vulnerable, Not Vulnerable
   */
  vulnerabilityStatus?: 'NOTVUL' | 'POTVUL' | 'VUL';

  /**
   * The reason why a network element is Vulnerable or Potentially Vulnerable to a Security Advisory
   */
  vulnerabilityReason?: string;

  /**
   * When set to true (Y), it indicates that the PSIRT is publicly available. Otherwise it is internal use only to authorized users
   */
  publicReleaseIndicator?: 'Y' | 'N';
}
