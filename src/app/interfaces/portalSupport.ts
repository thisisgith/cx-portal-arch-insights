/**
 * Contract Interface
 */
export interface EmailRequest {
    body: string;
    cc?: string;
    from?: string;
    htmlBody?: boolean;
    replyTo?: string;
    subject: string;
    to: string;
  }