import { Component, Input } from '@angular/core';

/**
 * InstallProgressComponent
 */
@Component({
	selector: 'install-progress',
	styleUrls: ['./install-progress.component.scss'],
	templateUrl: './install-progress.component.html',
})
export class InstallProgressComponent {
	@Input() public view: 'k9' | 'eula' | 'pre-download' | 'connect';
}
