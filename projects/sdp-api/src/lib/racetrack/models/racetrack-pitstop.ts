/* tslint:disable */
import { RacetrackPitstopAction } from './racetrack-pitstop-action';
export interface RacetrackPitstop {

  /**
   * The name of the pitstop (onboard | implement | use | engage | adopt | optimize)
   */
  name: string;

  /**
   * Brief description of the pitstop
   */
  description: string;

  /**
   * When set to true it indicates that the pre-requisites for advancing to the next pitstop have been met by the customer. This determination may be done through manual input (customer) or automated (LifecycleJourney).
   */
  isComplete: boolean;
  pitstopActions: Array<RacetrackPitstopAction>;
}
