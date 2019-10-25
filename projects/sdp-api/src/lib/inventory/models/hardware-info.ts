/* tslint:disable */
import { SolutionInfo } from './solution-info';
export interface HardwareInfo {

  /**
   * The product name reported by PCE. Examples:- Cisco UCS B200 M4 Blade Server, UCS-IOM-2208XP, N20-FAN5
   */
  productName?: string;

  /**
   * Unique identifier of a Cisco customer
   */
  customerId: string;

  /**
   * Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
   */
  hostname?: string;

  /**
   * The address used to communicate with the managed NE. The synatx of this value is RFC2851.InetAddressType
   */
  managementAddress: string;

  /**
   * The unique identifier for hardware entry in a datastore
   */
  hwInstanceId: string;

  /**
   * This is a reference to the physical container (equipment holder). For example, module’s container is the chassis.
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
   * The unique, generated ID of the managed network element
   */
  managedNeId: string;

  /**
   * An indication of the general hardware type of the physical entity (e.g. CHASSIS, MODULE, POWER SUPPLY, POWERSUPPLY, FAN, IPPHONE, OTHER)
   */
  equipmentType?: string;

  /**
   * The description of a product
   */
  productDescription?: string;

  /**
   * This refers to the OS running on the managed network element. For example:- IOS, IOS-XE, NxOS
   */
  swType?: string;

  /**
   * The version of the softwareType running on the managed NE
   */
  swVersion?: string;

  /**
   * The specific version of the software (Software Type) that is installed on the Network Element. Example:- 15.1(4)M4
   */
  tags?: Array<string>;
  wfid?: string;
  solutionInfo?: Array<SolutionInfo>;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
}
