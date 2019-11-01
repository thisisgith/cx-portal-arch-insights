/* tslint:disable */
import { FeedbackSchema } from './feedback-schema';
import { ProviderSchema } from './provider-schema';
import { AtxSessionSchema } from './atx-session-schema';
export interface AtxSchema {

  /**
   * Unique Id of the ATX Id
   */
  atxId?: string;

  /**
   * Is bookmark
   */
  bookmark?: boolean;

  /**
   * Description of the ATX
   */
  description?: string;
  feedbackInfo?: FeedbackSchema;
  providerInfo?: ProviderSchema;

  /**
   * Duration of the session in seconds
   */
  duration?: number;

  /**
   * URL of the image to be displayed
   */
  imageURL?: string;

  /**
   * Pitstop
   */
  recordingURL?: string;

  /**
   * List of available sessions for selected ATX
   */
  sessions?: Array<AtxSessionSchema>;

  /**
   * Status of the ATX
   */
  status?: 'recommended' | 'requested' | 'scheduled' | 'in-progress' | 'completed';

  /**
   * Title of the ATX
   */
  title?: string;
}
