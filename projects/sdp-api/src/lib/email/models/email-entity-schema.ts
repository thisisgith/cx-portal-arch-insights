/* tslint:disable */

/**
 * Email object structure stored in ES
 */
export interface EmailEntitySchema {

  /**
   * Email body text. Can support HTML content if htmlBody attribute is set to true
   */
  body?: string;

  /**
   * A unique identifier for the email
   */
  emailId?: string;

  /**
   * A single 'From' address
   */
  from?: string;

  /**
   * A flag to indicate if the body should be treated as HTML text
   */
  htmlBody?: boolean;

  /**
   * The ccoId of the user requesting the Email
   */
  sender?: string;

  /**
   * Email status
   */
  status?: string;

  /**
   * Email body subject
   */
  subject?: string;

  /**
   * Epoch timestamp of when the Email was sent
   */
  timestamp?: number;

  /**
   * 'To' addresses in RFC822 format
   */
  to: string;
}
