import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { RouterModule, Routes } from '@angular/router';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { ChartModule } from 'angular-highcharts';
import { AlertService } from '@services';
import { AlertInfoModule } from './alert-info/alert-info.module';
import { AlertSidebarModule } from './alert-sidebar/alert-sidebar.module';
import { CuiSpinnerModule, CuiTableModule, CuiGaugeModule } from '@cisco-ngx/cui-components';

/**
 * Routes for lazy loading
 */
const childRoutes: Routes = [
	{
		component: InventoryComponent,
		path: '',
	},
];

/**
 * Module representing the Inventory Page Component
 */
@NgModule({
	declarations: [InventoryComponent],
	imports: [
		AlertInfoModule,
		AlertSidebarModule,
		ChartModule,
		CommonModule,
		CuiGaugeModule,
		CuiSpinnerModule,
		CuiTableModule,
		I18nPipeModule,
		CuiTableModule,
		RouterModule.forChild(childRoutes),
	],
	providers: [AlertService],
})
export class InventoryModule { }
