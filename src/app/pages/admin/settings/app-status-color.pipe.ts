import { Pipe, PipeTransform } from '@angular/core';

/**
 * Gets the color class for a given Application status
 */
@Pipe({
	name: 'appStatusColor',
})
export class AppStatusColorPipe implements PipeTransform {
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
		const classVal = {
			ContainerCreation: 'text-warning',
			Pending: 'text-warning',
			PodInitializing: 'text-warning',
			Running: 'text-success',
			Stopped: 'text-secondary',
		}[status];

		return classVal ? classVal : 'text-danger';
	}
}
