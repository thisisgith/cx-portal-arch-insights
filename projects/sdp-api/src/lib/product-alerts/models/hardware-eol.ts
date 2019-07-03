/* tslint:disable */
export interface HardwareEOL {

  /**
   * Unique identifier of a Cisco customer
   */
  customerId?: string;

  /**
   * The unique, generated ID of the managed network element
   */
  managedNeId?: string;

  /**
   * The unique, generated ID of the network element
   */
  neInstanceId?: string;

  /**
   * The unique identifier for hardware entry in a datastore
   */
  hwInstanceId?: string;

  /**
   * The alphanumeric identifier used by customers to order Cisco products. Examples:- CISCO2921/K9 ; WS-C3750X-24S-S ; WS-X6748-GE-TX
   */
  productId?: string;

  /**
   * An indication of the general hardware type of the physical entity (e.g. CHASSIS, MODULE, POWER SUPPLY, POWERSUPPLY, FAN, IPPHONE, OTHER)
   */
  equipmentType?: string;

  /**
   * The unique identifier for hardware end-of-life entry in a data store
   */
  hwEolInstanceId?: string;

  /**
   * Bulletin Name
   */
  bulletinName?: string;
}
