/* tslint:disable */
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
  status?: 'Completed' | 'Recommended' | 'Scheduled' | 'In Progress';

  /**
   * Title of the ATX
   */
  title?: string;
}
