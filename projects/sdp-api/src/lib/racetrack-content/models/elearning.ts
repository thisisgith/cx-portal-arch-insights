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
  ranking?: number;

  /**
   * rating marked by the user for the content
   */
  rating?: string;

  /**
   * The number of filled stars, based off of the rating
   */
  filledStars?: number[];

  /**
   * The number of unfilled stars, based off of the rating
   */
  unfilledStars?: number[];

  /**
   * The number of half filled stars, based off of the rating
   */
  halfFilledStars?: number[];

  /**
   * CX Level
   */
  cxlevel?: number;
}
