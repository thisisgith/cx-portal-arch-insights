/* tslint:disable */
import { FeedbackSchema } from './feedback-schema';
import { ProviderSchema } from './provider-schema';
import { AtxSessionSchema } from './atx-session-schema';
export interface AtxSchema {

  /**
   * Duration of the session in seconds
   */
  duration?: number;

  /**
   * Unique Id of the ATX Id
   */
  atxId?: string;

  /**
   * Description of the ATX
   */
  description?: string;
  feedbackInfo?: FeedbackSchema;
  providerInfo?: ProviderSchema;

  /**
   * Is bookmark
   */
  bookmark?: boolean;

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
  status?: 'completed' | 'recommended' | 'scheduled' | 'requested' | 'in-progress';

  /**
   * Title of the ATX
   */
  title?: string;
}
