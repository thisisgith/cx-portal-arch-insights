import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupIeComponent } from './setup-ie.component';

/**
 * Guidelines Module Routes
 */
export const routes: Routes = [
	{
		component: SetupIeComponent,
		path: '',
	},
];

/**
 * Guidelines Routes Module
 */
export const SetupIeRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
