import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import { Asset } from '@sdp-api';

export enum CoverageType {
	COVERED = 'covered',
	OVERDUE = 'overdue',
	EXPIRED = 'expired',
	TERMINATED = 'terminated',
}

/**
	* Returns whether a provided Asset may open a CSOne case
	*/
@Pipe({
	name: 'canOpenCase',
})
export class CanOpenCasePipe implements PipeTransform {
	/**
	 * Perform the transform
	 * @param asset the asset we're checking
	 * @param contractEndDate contract end date as ISO string
	 * @returns boolean that indicates if a case may be opened
	 */
	public transform (asset: Asset, contractEndDate: string): boolean {
		if (asset && asset.supportCovered) {
			return true;
		}
		if (!asset || !contractEndDate) {
			return false;
		}
		// If it's expired but within 90 days, allow to open
		const endDate = DateTime.fromISO(contractEndDate);
		if (Math.abs(endDate.diffNow('days').days) < 90) {
			return true;
		}

		return false;
	}
}

/**
	* Returns whether a provided Asset may open a CSOne case
	*/
@Pipe({
	name: 'coverageStatus',
})
export class CoverageStatusPipe implements PipeTransform {
	/**
	 * Perform the transform
	 * @param contractEndDate contract end date as ISO string
	 * @returns CoverageType that indicates the asset's current coverage
	 */
	public transform (contractEndDate: string): CoverageType {
		if (!contractEndDate) {
			return CoverageType.TERMINATED;
		}
		const endDate = DateTime.fromISO(contractEndDate);
		if (endDate.diffNow('days').days > 0) {
			return CoverageType.COVERED;
		}
		if (Math.abs(endDate.diffNow('days').days) < 90) {
			return CoverageType.OVERDUE;
		}

		return CoverageType.EXPIRED;
	}
}

/**
 * Module for custom dateTime pipe
 */
@NgModule({
	declarations: [
		CanOpenCasePipe,
		CoverageStatusPipe,
	],
	exports: [
		CanOpenCasePipe,
		CoverageStatusPipe,
	],
	imports: [
		CommonModule,
	],
	providers: [
		CanOpenCasePipe,
		CoverageStatusPipe,
	],
})
export class AssetsPipeModule { }
