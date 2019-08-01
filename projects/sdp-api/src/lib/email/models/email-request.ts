/* tslint:disable */

/**
 * Email request structure
 */
export interface EmailRequest {

  /**
   * Email body text. Can support HTML content if htmlBody attribute is set to true
   */
  body?: string;

  /**
   * A single 'From' address
   */
  from?: string;

  /**
   * A flag to indicate if the body should be treated as HTML text
   */
  htmlBody?: boolean;

  /**
   * Email body subject
   */
  subject?: string;

  /**
   * 'To' addresses in RFC822 format
   */
  to: string;
}
