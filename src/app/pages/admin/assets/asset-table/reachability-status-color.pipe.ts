import { Pipe, PipeTransform } from '@angular/core';

/**
 * Gets the color class for a given Application status
 */
@Pipe({
	name: 'statusColor',
})
export class ReachabilityStatusColorPipe implements PipeTransform {
	/**
	 * Transforms the data
	 * @param value {string}
	 * @returns class
	 */
	public transform (value: string): string {
		return this.iconColor(value);
	}

	/**
	 * Returns bootstrap class name for icon color
	 * @param {String} status - app status string
	 * @returns - Returns bootstrap class name for icon color
	 */
	private iconColor (status: string) {
		const styleColor = {
			'Authorization Failed': '#e3e3e3',
			Connecting: '#fbab18',
			Reachable: '#6cc04a',
			Unreachable: '#bec1c3',
		}[status];

		return styleColor ? styleColor : '#e3e3e3';
	}
}
