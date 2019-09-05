import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupIeComponent } from './setup-ie.component';
import { SetupHelpComponent } from './help';

/**
 * Guidelines Module Routes
 */
export const routes: Routes = [
	{
		component: SetupHelpComponent,
		path: 'help',
	},
	{
		component: SetupIeComponent,
		path: '',
	},
];

/**
 * Guidelines Routes Module
 */
export const SetupIeRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
