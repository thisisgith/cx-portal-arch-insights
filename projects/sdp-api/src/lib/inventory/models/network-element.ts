/* tslint:disable */
import { SolutionInfo } from './solution-info';
export interface NetworkElement {

  /**
   * The specific version of the software (Software Type) that is installed on the Network Element
   */
  swVersion?: string;

  /**
   * Unique identifier of a Cisco customer
   */
  customerId: string;

  /**
   * The unique, generated ID of the network element
   */
  neInstanceId: string;

  /**
   * Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
   */
  hostName?: string;
  neName?: string;

  /**
   * Management IP Address of the Device
   */
  managementAddress: string;
  neRegistrationStatus?: string;

  /**
   * A numerical label assigned to each device (For example, computer, printer) participating in a computer network that uses the Internet Protocol for communication
   */
  ipAddress?: string;

  /**
   * Indicates whether the device is directly managed by the collector
   */
  isManagedNE: boolean;
  lastUpdateDate?: string;
  tags?: Array<string>;

  /**
   * Product family the device belongs to
   */
  productFamily?: string;

  /**
   * Refers to the validated product ID of the device. GMT date format YYYY-MM-DDTHH:MM:SS (Time is displayed in 24 hour format)
   */
  productId?: string;

  /**
   * A broad classification of Cisco product that categorizes its function
   */
  productType?: string;

  /**
   * Software Type identifies the specific type of software that is installed on this host/system
   */
  swType?: string;

  /**
   * The unique, generated ID of the network resource id
   */
  managedNeId?: string;
  serialNumber?: string;
  systemUptime?: string;
  udiProductIdentifier?: string;
  smartLicenseProductInstanceIdentifier?: string;
  smartLicenseVirtualAccountName?: string;
  installedMemory?: number;

  /**
   * The date timestamp of the last reset of the device as reported by the show version command
   */
  timeOfLastReset?: string;

  /**
   * The reason for the last system reset as reported in the show version output
   */
  lastResetReason?: string;

  /**
   * The SNMP sysObjectID of the network element
   */
  sysObjectId?: string;

  /**
   * The Image Name of the software on the Network Element
   */
  imageName?: string;
  wfid?: string;
  solutionInfo?: Array<SolutionInfo>;
  cxLevel?: string;
  saId?: number;
  vaId?: Array<number>;
}
