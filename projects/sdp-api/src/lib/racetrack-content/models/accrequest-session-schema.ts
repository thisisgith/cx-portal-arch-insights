/* tslint:disable */
import { ACCSessionAttendees } from './accsession-attendees';
export interface ACCRequestSessionSchema {

  /**
   * Title of the accelerator.
   */
  accTitle?: string;

  /**
   * list of additional attendees for the requested session.
   */
  additionalAttendees?: Array<ACCSessionAttendees>;

  /**
   * Expected business outcomes of the requested session.
   */
  businessOutcome?: string;

  /**
   * Unique identifier of a Cisco customer.
   */
  customerId?: string;

  /**
   * Version of the DNA-C
   */
  dnacVersion?: string;

  /**
   * User's own non-prod environment or a Cisco provided lab environment for delivery of the acc.
   */
  environment?: string;

  /**
   * pitsop name (onboard | implement | use | engage)
   */
  pitstop?: string;

  /**
   * Preferred language for meetings/working sessions
   */
  preferredLanguage?: string;

  /**
   * Prefered time for meetings/working sessions (morning | afternoon)
   */
  preferredSlot?: string;

  /**
   * Provider/Partner Id who is conducting an accelerator
   */
  providerId?: string;

  /**
   * Provider/Partner Name who is conducting an accelerator
   */
  providerName?: string;

  /**
   * Interest for choosing this accelerator and the ask from Cisco.
   */
  reasonForInterest?: string;

  /**
   * ibn
   */
  solution?: string;

  /**
   * Timezone of the logged in user.
   */
  timezone?: string;

  /**
   * usecase name (assurance | sd-access | automation)
   */
  usecase?: string;
}
