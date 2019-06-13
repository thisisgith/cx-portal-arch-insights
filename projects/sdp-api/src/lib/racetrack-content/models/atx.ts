/* tslint:disable */
import { ATXSession } from './atxsession';
export interface ATX {

  /**
   * Cisco DNA Assurance Overview
   */
  title?: string;

  /**
   * We cover subjects including interface and network design overview, policy management and deployment, device provisioning, and automation/assurance.
   */
  description?: string;

  /**
   * 1h 15m
   */
  duration?: string;

  /**
   * Webinar Registration Url
   */
  registrationUrl?: string;

  /**
   * Webinar View on demand Url
   */
  viewOnDemandUrl?: string;

  /**
   * Romeo Mezzaluna
   */
  moderator?: string;

  /**
   * https://cisco.webex.com/cisco/onstage/g.php?MTID=eccf7e6179a44cccb7122b72fec6b0bda
   */
  attendeeLink?: string;

  /**
   * https://cisco.webex.com/cisco/onstage/g.php?MTID=eb40d87cef96b76506515040c7440b84c
   */
  panelistLink?: string;
  sessions?: Array<ATXSession>;
}
