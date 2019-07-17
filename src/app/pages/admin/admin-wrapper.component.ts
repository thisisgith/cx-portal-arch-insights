import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Admin Component
 */
@Component({
	selector: 'admin-wrapper',
	styleUrls: ['./admin-wrapper.component.scss'],
	templateUrl: './admin-wrapper.component.html',
})
export class AdminWrapperComponent {
	public sidebarOptions = {
		color: 'dkgray',
		compressed: false,
		items: [
			{
				icon: 'icon-account',
				onClick: () => {
					// TODO
				},
				shortTitle: I18n.get('_Settings_'),
				title: I18n.get('_Settings_'),
			},
			{
				icon: 'icon-account',
				onClick: () => {
					// TODO
				},
				shortTitle: I18n.get('_Policies_'),
				title: I18n.get('_Policies_'),
			},
		],
		mini: true,
		oneDrawerOpen: false,
		title: 'cui-sidebar',
	};
	constructor (
		private location: Location,
	) { }

	/**
	 * Goes back to the previous page
	 */
	public goBack () {
		// TODO: It might be better to only go back when the previous location is part of this App.
		// If not, it should navigate to the home page. We would have to start storing the previous
		// location in a service to accomplish this.
		this.location.back();
	}
}
