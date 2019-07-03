/* tslint:disable */
export interface FieldNotice {

  /**
   * The name of a group of products derived from a common product platform
   */
  productFamily?: string;

  /**
   * Unique identifier of a Cisco customer
   */
  customerId?: string;

  /**
   * The unique, generated ID of the network element
   */
  neInstanceId?: Array<string>;

  /**
   * The unique identifier for hardware entry in a datastore
   */
  hwInstanceId?: number;

  /**
   * The vendor-specific model name identifier string associated with this physical component
   */
  productId?: string;

  /**
   * This refers to the OS running on the managed network element. For example:- IOS, IOS-XE, NxOS
   */
  swType?: Array<string>;

  /**
   * The recognized/validated Serial Number
   */
  serialNumber?: string;

  /**
   * The unique, generated ID of the network resource id
   */
  managedNeId?: Array<string>;

  /**
   * A broad classification of Cisco product that categorizes its function.Examples :- OTHER, CHASIS, MODULE, POWERSUPPLY, FAN, IPPHONE
   */
  equipmentType?: string;

  /**
   * The unique, generated ID of the field notices
   */
  fieldNoticeId?: number;

  /**
   * The Cisco.com Title/Headline for the bulletin
   */
  bulletinTitle?: string;

  /**
   * The vulnerability status of a Network element. Example:- Vulnerable, Potentially Vulnerable, Not Vulnerable
   */
  vulnerabilityStatus?: string;

  /**
   * The reason why a network element is Vulnerable or Potentially Vulnerable to a Security Advisory
   */
  vulnerabilityReason?: string;

  /**
   * The distribution code of the field notices
   */
  distributionCode?: boolean;

  /**
   * The explanations about why the automation may need additional review by the customer
   */
  caveat?: string;
}
