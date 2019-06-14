/* tslint:disable */
export interface SoftwareInfo {

  /**
   * Unique identifier of a Cisco customer.
   */
  customerId?: string;

  /**
   * The unique, generated ID of the network element
   */
  managedNeInstanceId?: number;

  /**
   * The name of inventory given by customers
   */
  inventoryName?: string;

  /**
   * Software Type identifies the specific type of software that is installed on this host/system.
   */
  swType?: string;

  /**
   * The specific version of the software (Software Type) that is installed on the Network Element. Example: 15.1(4)M4
   */
  swVersion?: string;

  /**
   * The major version portion of the software version. Example: 15.1
   */
  swMajorVersion?: string;

  /**
   * The broader category of the software record. The Role of the Software running on a Network Element. Example: System Software, Application Software; Patch; Package
   */
  swCategory?: string;

  /**
   * The Status of the Software running on the Network Element. Default value is ACTIVE. For PIE and SMU it can also be COMMITTED
   */
  swStatus?: string;

  /**
   * The Name of the Software running on Network Element. For System SW, the value is the Image Name. For PIE it is the package name and for SMU the SMU name. Example: asr9k-p-4.2.3.CSCtz41749-1.0.0
   */
  swName?: string;
}
