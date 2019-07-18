/* tslint:disable */
export interface ACCUserInfoSchema {

  /**
   * Company name of the logged in user from profile.
   */
  companyName?: string;

  /**
   * Job title of the logged in user from profile.
   */
  jobTitle?: string;

  /**
   * Email Id of the logged in user from profile.
   */
  userEmail?: string;

  /**
   * Phone number of the logged in user from profile.
   */
  userPhoneNumber?: string;

  /**
   * Cisco Contact name or email for the logged in user.
   */
  ciscoContact?: string;

  /**
   * CCO Id of the logged in user
   */
  ccoId?: string;

  /**
   * Country name of the logged in user from profile.
   */
  country?: string;
}
