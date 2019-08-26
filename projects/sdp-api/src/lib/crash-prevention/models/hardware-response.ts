/* tslint:disable */
import { IHardware } from './hardware-info';

/**
 * The hardware in the inventory
 */
export interface IHardwareResponse {
  data: Array<IHardware>;
}
