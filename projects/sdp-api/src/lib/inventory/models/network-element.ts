/* tslint:disable */
export interface NetworkElement {

  /**
   * The name of the software feature set running on the device. This data is primarily available for IOS
   */
  featureSet?: string;

  /**
   * Unique identifier of a Cisco customer
   */
  customerId: string;

  /**
   * The unique, generated ID of the network element
   */
  neInstanceId: string;

  /**
   * The unique, generated ID of the network resource instance id
   */
  managedNeInstanceId?: number;

  /**
   * The unique, generated ID of the network resource id
   */
  managedNeId?: string;

  /**
   * Inventory Name of the processed Inventory File
   */
  inventoryName?: string;

  /**
   * Hostname for the Element
   */
  hostName?: string;
  neName?: string;
  neRegistrationStatus?: string;
  lastUpdateDate?: string;
  tags?: Array<string>;
  serialNumber?: string;
  systemUptime?: string;
  udiProductIdentifier?: string;
  smartLicenseProductInstanceIdentifier?: string;
  smartLicenseVirtualAccountName?: string;

  /**
   * Management IP Address of the Device
   */
  managementAddress: string;

  /**
   * NE Subtype of the Device
   */
  neSubtype?: string;

  /**
   * Inventory Availability
   */
  inventoryAvailability?: string;

  /**
   * Last Config Register
   */
  lastConfigRegister?: string;

  /**
   * A numerical label assigned to each device (For example, computer, printer) participating in a computer network that uses the Internet Protocol for communication
   */
  ipAddress?: string;

  /**
   * Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
   */
  hostname?: string;

  /**
   * The SNMP sysName of the network element. It will be a fully-qualified name, if domain name is set on the device
   */
  sysName?: string;

  /**
   * The unique identifier for a Cisco Collector (CSPC) appliance
   */
  collectorId?: string;

  /**
   * The time when the collector last successfully collected inventory from the device. GMT date format YYYY-MM-DDTHH:MM:SS (Time is displayed in 24 hour format)
   */
  inventoryCollectionDate?: string;

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
   * The date when the network element was first added to inventory. GMT date format YYYY-MM-DDTHH:MM:SS (Time is displayed in 24 hour format)
   */
  createDate?: string;

  /**
   * Software Type identifies the specific type of software that is installed on this host/system
   */
  swType?: string;

  /**
   * The specific version of the software (Software Type) that is installed on the Network Element
   */
  swVersion?: string;

  /**
   * The status of the device as reported by the collector. Example:- Reachable or Not Reachable
   */
  reachabilityStatus?: string;

  /**
   * The type of the network element. Values include COMPOSITE, COMPOSED, VIRTURAL, APPLICATION, STANDALONE
   */
  neType?: string;

  /**
   * The date timestamp of the last reset of the device as reported by the show version command
   */
  timeOfLastReset?: string;

  /**
   * The reason for the last system reset as reported in the show version output
   */
  lastResetReason?: string;

  /**
   * The SNMP sysContact of the network element which is populated in most devices using a configuration command
   */
  sysContact?: string;

  /**
   * The SNMP system description from the network element
   */
  sysDescr?: string;

  /**
   * The SNMP sysLocation of the network element which is populated in most devices using a configuration command
   */
  sysLocation?: string;

  /**
   * The SNMP sysObjectID of the network element
   */
  sysObjectId?: string;

  /**
   * The Configuration register of the device at the next reload
   */
  configRegister?: string;

  /**
   * The availability of Network Element Configuration data for analytics. Example:- Available, Not Available, Not Supported
   */
  configAvailability?: string;

  /**
   * The Date and time when the collector last successfully collected the configuration from the device. GMT date format YYYY-MM-DDTHH:MM:SS (Time is displayed in 24 hour format)
   */
  configCollectionDate?: string;

  /**
   * The Image Name of the software on the Network Element
   */
  imageName?: string;

  /**
   * The version of the boot code installed on the device
   */
  bootstrapVersion?: string;

  /**
   * Indicates whether the device is directly managed by the collector
   */
  isManagedNE: boolean;

  /**
   * A media access control address (MAC address) is a unique identifier assigned to network interfaces for communications on the physical network segment
   */
  macAddress?: string;
  installedMemory?: number;
}
