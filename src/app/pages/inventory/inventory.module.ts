import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { RouterModule, Routes } from '@angular/router';

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
		RouterModule.forChild(childRoutes),
	],
})
export class InventoryModule { }
