/* tslint:disable */
export interface FieldNotice {

  /**
   * The Cisco.com Title/Headline for the bulletin
   */
  bulletinTitle?: string;

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
   * This refers to the OS running on the managed network element. For example:- IOS, IOS-XE, NxOS
   */
  swType?: string;

  /**
   * The recognized/validated Serial Number
   */
  serialNumber?: string;

  /**
   * The name of a group of products derived from a common product platform
   */
  productFamily?: string;

  /**
   * A broad classification of Cisco product that categorizes its function.Examples :- OTHER, CHASIS, MODULE, POWERSUPPLY, FAN, IPPHONE
   */
  equipmentType?: string;

  /**
   * The unique, generated ID of the field notices
   */
  fieldNoticeId?: number;

  /**
   * The unique, generated ID of the network resource id
   */
  managedNeId?: string;

  /**
   * The vulnerability status of a Network element. Example:- Vulnerable, Potentially Vulnerable, Not Vulnerable
   */
  vulnerabilityStatus?: 'NOTVUL' | 'POTVUL' | 'VUL';

  /**
   * The reason why a network element is Vulnerable or Potentially Vulnerable to a Security Advisory
   */
  vulnerabilityReason?: string;

  /**
   * The distribution code of the field notices
   */
  distributionCode?: string;

  /**
   * The explanations about why the automation may need additional review by the customer
   */
  caveat?: string;
  ipAddress?: string;
  hostname?: string;
  swVersion?: string;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
}
