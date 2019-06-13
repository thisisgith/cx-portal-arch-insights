/* tslint:disable */
export interface SoftwareEOLResponseObjectInfo {

  /**
   * Unique identifier of a Cisco customer
   */
  customerId?: string;

  /**
   * The unique, generated ID of the network element
   */
  neInstanceId?: string;

  /**
   * The unique, generated ID of the network element
   */
  managedNeId?: string;

  /**
   * The alphanumeric identifier used by customers to order Cisco products. Examples:- CISCO2921/K9 ; WS-C3750X-24S-S ; WS-X6748-GE-TX
   */
  productId?: string;

  /**
   * An indication of the general hardware type of the physical entity (e.g. CHASSIS, MODULE, POWER SUPPLY, POWERSUPPLY, FAN, IPPHONE, OTHER)
   */
  equipmentType?: string;

  /**
   * Software Type identifies the specific type of software that is installed on this host/system. Common values include IOS, IOS XR, IOS-XE, NX-OS, etc
   */
  swType?: string;

  /**
   * The specific version of the software (Software Type) that is installed on the Network Element. Example:- 15.1(4)M4
   */
  swVersion?: string;

  /**
   * The Cisco.com Title/Headline for the bulletin
   */
  bulletinHeadline?: string;

  /**
   * The unique identifier for software end-of-life entry in a data store
   */
  swEolInstanceId?: string;
}
