/* tslint:disable */
export interface PitstopActionUpdateResponse {

  /**
   * When set to true it indicates that new ATX sessions are available to the customer / user
   */
  isAtxChanged: boolean;

  /**
   * When set to true it indicates that new accelerator content is available to the customer / user
   */
  isAccChanged: boolean;

  /**
   * When set to true it indicates that new e-learning content is available to the customer / user
   */
  isElearningChanged: boolean;

  /**
   * When set to true it indicates that new communities are available to the customer / user
   */
  isCommunitiesChanged: boolean;

  /**
   * When set to true it indicates that new success content is available to the customer / user
   */
  isSuccessPathChanged: boolean;

  /**
   * When set to true it indicate that new CGT content is available to the customer / user
   */
  isCgtChanged: boolean;
}
