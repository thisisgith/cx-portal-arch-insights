/* tslint:disable */

/**
 * Atx User Registrations
 */
export interface AtxUserRegistrationsSchema {

  /**
   * The Atx Id
   */
  atxId?: string;

  /**
   * User CCO Id
   */
  ccoId?: string;

  /**
   * Customer Id
   */
  customerId?: string;

  /**
   * Partner Id
   */
  partnerId?: string;

  /**
   * The Session Id of this Atx
   */
  sessionId?: string;

  /**
   * The Registration status
   */
  transactionType?: 'requested' | 'scheduled' | 'cancelled' | 'completed';
}
