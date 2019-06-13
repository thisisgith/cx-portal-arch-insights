/* tslint:disable */
export interface RacetrackPitstopAction {

  /**
   * A label identifying the action to be completed by the customer.  A set of actions identifies the exit criteria that must be met before proceeding to the next stage
   */
  name: string;

  /**
   * A brief description of the action to be taken by the customer
   */
  description: string;

  /**
   * When set to true it indicates that this action may be manually checked as completed/met. Otherwise completion must be automatically determined via analysis of collected data
   */
  manualCheckAllowed: boolean;

  /**
   * When set to true it indicates that this action has been completed by the customer.  This is the reported status and it is set from one of isActionCompleteAuto (Auto determined), isActionCompleteManual (Manually determined). Manual input takes precedence over the automated means and once set to manual it cannot be changed by automated means. It requires manual input
   */
  isComplete: boolean;

  /**
   * The method by which the the completion status was updated (MANUAL user input, AUTO Lifecycle Journey). This value must be set when isActionComplete is set to true and cleared if isActionComplte is set to false
   */
  updateMethod: 'NA' | 'MANUAL' | 'AUTO';

  /**
   * When set to true it indicates that this action was found to be completed/met through automated means.  An action manually set to completion takes precedence over the automated means.  An action set to completion via automated means may be manually overridden
   */
  isCompleteAuto: boolean;

  /**
   * When set to true it indicates that action was manually set to completed / met
   */
  isCompleteManual: boolean;

  /**
   * When set to true it indicates that the automated result was overriden manually by a user
   */
  isManaualOverride: boolean;
}
