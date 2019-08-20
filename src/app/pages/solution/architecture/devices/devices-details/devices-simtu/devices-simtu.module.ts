import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesSimtuComponent } from './devices-simtu.component';

/** Module representing the Devices Switch Interface MTU Component */
@NgModule({
	declarations: [DevicesSimtuComponent],
	exports: [DevicesSimtuComponent],
	imports: [
		CommonModule,
	],
})
export class DevicesSimtuModule { }
