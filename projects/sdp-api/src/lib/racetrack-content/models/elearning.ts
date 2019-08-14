/* tslint:disable */
export interface ELearning {

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
   * http://elearning.com
   */
  url?: string;

  /**
   * ranking of the content
   */
  ranking?: number;

  /**
   * rating marked by the user for the content
   */
  rating?: string;

  /**
   * CX Level
   */
  cxlevel?: number;

  /**
   * Percentage completion of a given course
   */
  percentageCompleted?: number;
}
