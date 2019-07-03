/* tslint:disable */
export interface SecurityAdvisory {

  /**
   * The description of a product
   */
  productDescription?: string;

  /**
   * Unique identifier of a Cisco customer
   */
  customerId?: string;

  /**
   * The unique, generated ID of the network element
   */
  neInstanceId?: Array<string>;

  /**
   * Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
   */
  hostname?: string;

  /**
   * The unique identifier for hardware entry in a datastore
   */
  hwInstanceId?: string;

  /**
   * This
   */
  containingHwId?: string;

  /**
   * The recognized/validated Serial Number
   */
  serialNumber?: string;

  /**
   * The vendor-specific model name identifier string associated with this physical component
   */
  productId?: string;

  /**
   * The name of a group of products derived from a common product platform
   */
  productFamily?: string;

  /**
   * A single term that defines the physical nature of the product. This value is derived based on the following order of preference:- PCE, SNAS. Examples:- Firewall, Access Point
   */
  productType?: string;

  /**
   * The product name reported by PCE. Examples:- Cisco UCS B200 M4 Blade Server, UCS-IOM-2208XP, N20-FAN5
   */
  productName?: string;

  /**
   * An indication of the general hardware type of the physical entity (e.g. CHASSIS, MODULE, POWER SUPPLY, POWERSUPPLY, FAN, IPPHONE, OTHER)
   */
  equipmentType?: string;

  /**
   * The unique, generated ID of the network resource id
   */
  managedNeId?: Array<string>;
  tags?: Array<string>;

  /**
   * This refers to the OS running on the managed network element. For example:- IOS, IOS-XE, NxOS
   */
  swType?: string;

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
  vulnerabilityStatus?: string;

  /**
   * The reason why a network element is Vulnerable or Potentially Vulnerable to a Security Advisory
   */
  vulnerabilityReason?: string;

  /**
   * Common Vulnerabilities and Exposures (CVE) Identifier
   */
  cveId?: string;

  /**
   * The date when the bulletin was first published to Cisco.com. GMT date format YYYY-MM-DD
   */
  bulletinFirstPublished?: string;

  /**
   * The version '#' of the Cisco.com bulletin. Only applicable to Security Advisories
   */
  bulletinVersion?: string;

  /**
   * When set to true, it indicates that the PSIRT is publicly available. Otherwise it is internal use only to authorized users
   */
  publicReleaseIndicator?: boolean;
}
