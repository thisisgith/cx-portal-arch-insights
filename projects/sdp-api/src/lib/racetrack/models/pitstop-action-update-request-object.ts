/* tslint:disable */

/**
 * This object is used to update a pitstop action for the identified solution/technology/pitstop
 */
export interface PitstopActionUpdateRequestObject {
  customerId: string;
  buId: string;

  /**
   * The solution
   */
  solution?: string;

  /**
   * The technology
   */
  technology: string;

  /**
   * The pitstop
   */
  pitstop: string;

  /**
   * The pitstop action being updated
   */
  pitstopAction: string;
}
