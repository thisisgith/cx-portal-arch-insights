/* tslint:disable */
import { RacetrackPitstop } from './racetrack-pitstop';
export interface RacetrackTechnology {

  /**
   * The use cases for the solution (wireless assurance, sd access, automation)
   */
  name: string;

  /**
   * Webinar Session Time
   */
  description: string;

  /**
   * The current customer's pitstop for this solution's use case
   */
  currentPitstop: string;
  pitstops: Array<RacetrackPitstop>;

  /**
   * Percentage completed checklist actions across all pitstops.
   */
  usecase_adoption_percentage?: number;
}
