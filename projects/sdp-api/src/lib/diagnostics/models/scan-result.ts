/* tslint:disable */
import { Command } from './command';
import { Alert } from './alert';
import { AlertCounts } from './alert-counts';
export interface ScanResult {

  /**
   * Start TimeStamp
   */
  startTimeStamp?: string;

  /**
   * This is the party identifier assigned by the profiling system
   */
  customerId?: string;

  /**
   * Result Id
   */
  resultId?: string;

  /**
   * Device ID
   */
  deviceId?: string;

  /**
   * Scan Id
   */
  scanId?: string;

  /**
   * Error Message
   */
  errorMessage?: string;

  /**
   * A serial number is a unique number used for identification.
   */
  serialNumber?: string;

  /**
   * End TimeStamp
   */
  endTimeStamp?: string;

  /**
   * Check Count
   */
  checkCount?: string;

  /**
   * Run Id
   */
  runId?: string;
  executedCommands?: Array<Command>;
  alerts?: Array<Alert>;
  alertCounts?: AlertCounts;
}
