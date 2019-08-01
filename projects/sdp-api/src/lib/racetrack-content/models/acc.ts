/* tslint:disable */
export interface ACC {

  /**
   * Unique identifier of the accelerator.
   */
  accId?: string;

  /**
   * DNA Assurance Self Guided Lab
   */
  title?: string;

  /**
   * Provides hands-on experience with the Cisco DNA Assurance components in your planned or existing environment. Follow the Assurance lab guide while using our Assurance training pod.
   */
  description?: string;

  /**
   * https://salesconnect.cisco.com/open.html?c=89230f5c-97e2-4891-99d0-42fcc953e7e1
   */
  url?: string;

  /**
   * Accelrator status for logged in user (recommended | completed | in-progress | scheduled)
   */
  status?: string;

  /**
   * If the User has favorite this item then it will be true else false
   */
  isFavorite?: boolean;
}
