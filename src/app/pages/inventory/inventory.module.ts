import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarModule } from '@components/sidebar/sidebar.module';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuiTableModule } from '@cisco-ngx/cui-components';

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
		FormsModule,
		ReactiveFormsModule,
		CuiTableModule,
		RouterModule.forChild(childRoutes),
	],
})
export class InventoryModule { }
