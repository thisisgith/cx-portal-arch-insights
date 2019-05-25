import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasesComponent } from './cases.component';
import { RouterModule, Routes } from '@angular/router';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';

/**
 * Child routes for Cases Module for lazy loading
 */
const childRoutes: Routes = [
	{
		component: CasesComponent,
		path: '',
	},
];

/**
 * Main Cases module
 */
@NgModule({
	declarations: [CasesComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(childRoutes),
		I18nPipeModule,
	],
})
export class CasesModule { }
