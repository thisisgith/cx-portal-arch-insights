/* tslint:disable */
import { Device } from './device';
import { Command } from './command';
export interface TransactionRequestBody {
  schedule?: string;
  deviceOptions?: string;
  devices?: Array<Device>;
  commands?: Array<Command>;
}
