/* tslint:disable */
import { ACCSessionAttendees } from './accsession-attendees';
export interface ACCRequestSessionSchema {

  /**
   * Title of the accelerator.
   */
  accTitle?: string;

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
   * Full Name of the logged in user from profile.
   */
  userFullName?: string;

  /**
   * Cisco Contact name or email for the logged in user.
   */
  ciscoContact?: string;

  /**
   * Country name of the logged in user from profile.
   */
  country?: string;
  additionalAttendees?: Array<ACCSessionAttendees>;

  /**
   * Timezone of the logged in user.
   */
  timezone?: string;

  /**
   * Prefered time for meetings/working sessions (morning | afternoon)
   */
  preferredSlot?: string;

  /**
   * Preferred language for meetings/working sessions
   */
  preferredLanguage?: string;

  /**
   * Version of the DNA-C
   */
  dnacVersion?: string;

  /**
   * Expected business outcomes of the requested session.
   */
  businessOutcome?: string;

  /**
   * Interest for choosing this accelerator and the ask from Cisco.
   */
  reasonForInterest?: string;

  /**
   * User's own non-prod environment or a Cisco provided lab environment for delivery of the acc.
   */
  environment?: string;

  /**
   * CCO Id of the logged in user
   */
  ccoId?: string;

  /**
   * Unique identifier of a Cisco customer.
   */
  customerId?: string;

  /**
   * ibn
   */
  solution?: string;

  /**
   * usecase name (assurance | sd-access | automation)
   */
  usecase?: string;

  /**
   * pitsop name (onboard | implement | use | engage)
   */
  pitstop?: string;
}
