/* tslint:disable */
// export interface IDeviceInfo {
//   /**
//    * Device name
//    */
//   deviceName?: string;

//   riskScore?: any;
  

//   /**
//    * Device name
//    */
//   ipAddress?: string;

//   /**
//    * Serial Number
//    */
//   serialNumber?: string;

//  }

 export interface IDeviceInfo{
   /**
   * Device name
   */
  deviceName?: string;
  customerId?: string;
  deviceId?: string;
  globalRiskRank?: string;
  riskScore?: any;
  productFamily?: string;
  productId?: string;
  softwareVersion?: string;
  softwareType?: string;
  

  /**
   * Device name
   */
  ipAddress?: string;

  /**
   * Serial Number
   */
  serialNumber?: string;
 }