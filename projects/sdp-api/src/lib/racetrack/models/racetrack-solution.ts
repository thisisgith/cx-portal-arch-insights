/* tslint:disable */
import { RacetrackTechnology } from './racetrack-technology';
export interface RacetrackSolution {

  /**
   * The solution the customer subscribes to (ibn, collab)
   */
  name: string;

  /**
   * We cover subjects including interface and network design overview, policy management and deployment, device provisioning, and automation/assurance.
   */
  description: string;
  technologies: Array<RacetrackTechnology>;
}
