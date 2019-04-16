import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarModule } from '@components/sidebar/sidebar.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Child routes for Inventory Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: InventoryComponent,
		path: '',
	},
];

/**
 * Module representing the Inventory Pages
 */
@NgModule({
	declarations: [InventoryComponent],
	imports: [
		CommonModule,
		SidebarModule,
		I18nPipeModule,
		RouterModule.forChild(childRoutes),
	],
})
export class InventoryModule { }
