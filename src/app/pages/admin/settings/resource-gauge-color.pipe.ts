import { Pipe, PipeTransform } from '@angular/core';

/**
 * Gets the color class for a given Guage status
 */
@Pipe({
	name: 'guageColor',
})
export class ResourceGaugeColorPipe implements PipeTransform {
	private threasholds = {
		bad: val => (val >= 80),
		good: val => (val < 60),
		warn: val => (val >= 60 && val < 80),
	};

	/**
	 * Transforms the data
	 * @param value {string}
	 * @returns class
	 */
	public transform (value: string): string {
		return this.gaugeColor(value);
	}

	/**
	 * Returns gauge color based off of threshold
	 * @param {String} percent - percent as a string
	 * @returns - Returns guage color
	 */
	private gaugeColor (percent: string) {
		const val = parseInt(percent, 10);
		let color = '';

		if (this.threasholds.good(val)) {
			color = '#6ebe4a';
		} else if (this.threasholds.warn(val)) {
			color = '#fbab18';
		} else if (this.threasholds.bad(val)) {
			color = '#e2231a';
		} else {
			color = '#000';
		}

		return color;
	}
}
