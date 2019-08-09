/* tslint:disable */
export interface SuccessPath {

  /**
   * Archetype
   */
  archetype?: string;

  /**
   * Boolean value to know if the success byte is bookmarked or not
   */
  bookmark?: boolean;

  /**
   * Getting started with installation
   */
  title?: string;

  /**
   * Avoid common pitfalls with how-tos and step-by-step videos that cruise you through installation of your new appliance from start to finish
   */
  description?: string;

  /**
   * 2h 5m
   */
  duration?: string;

  /**
   * mp4
   */
  type?: string;

  /**
   * http://ciscolearning.com
   */
  url?: string;
  successByteId?: string;
}
