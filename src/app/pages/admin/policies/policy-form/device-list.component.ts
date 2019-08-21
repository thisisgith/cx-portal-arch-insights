import {
	Component,
	Input,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { DeviceListRow } from './policy-form.component';

/**
 * Component for list
 */
@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'device-list',
	styleUrls: ['./device-list.component.scss'],
	templateUrl: './device-list.component.html',
})

export class DeviceListComponent {
	@ViewChild('container', { static: false }) public container: any;
	@Input() public rowHeight = 50;
	@Input() public items: DeviceListRow[];
	@Input() public loading: true;
	public itemsInView: DeviceListRow[];
	public startIndex = 0;
	public endIndex = 0;
	constructor (
		private logger: LogService,
	) { }

	/**
	 * Refreshes virtual list on after view init
	 */
	public ngAfterViewInit () {
		this.refresh();
	}

	/**
	 * Called when items is updated. Adds right items to view.
	 */
	public ngDoCheck () {
		if (this.items) {
			this.itemsInView = this.items.slice(this.startIndex, this.endIndex);
		}
	}

	/**
	 * Toggles is device row is selected
	 * @param device device row
	 */
	public toggleDeviceSelected (device: DeviceListRow) {
		device.selected = !device.selected;
	}

	/**
	 * Refreshes virtual scroll items
	 */
	public refresh () {
		if (this.container) {
			const scrollTop = this.container.nativeElement.scrollTop;
			const height = this.container.nativeElement.clientHeight;
			this.startIndex = Math.floor(scrollTop / this.rowHeight);
			this.endIndex = Math.ceil((scrollTop + height) / this.rowHeight);
			if (this.items) {
				this.itemsInView = this.items.slice(this.startIndex, this.endIndex);
			}
		}
	}
}
