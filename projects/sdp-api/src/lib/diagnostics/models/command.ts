/* tslint:disable */
export interface Command {

  /**
   * command
   */
  command?: string;

  /**
   * waitTimeBeforeMs
   */
  waitTimeBeforeMs?: string;

  /**
   * captureOutput
   */
  captureOutput?: string;

  /**
   * reference
   */
  reference?: string;
  expectlets?: Array<{regexp?: string, sendEnter?: boolean}>;
}
