/* tslint:disable */

/**
 * This object is used to update a pitstop action for the identified solution/technology/pitstop
 */
export interface PitstopActionUpdateRequest {

  /**
   * The solution
   */
  solution?: string;

  /**
   * The technology
   */
  technology?: string;

  /**
   * The pitstop
   */
  pitstop?: string;

  /**
   * The pitstop action being updated
   */
  pitstopAction?: string;

  /**
   * This is set to true when the user sets the checkbox in the UI. Set to false if the action is unchecked
   */
  actionComplete?: boolean;
}
