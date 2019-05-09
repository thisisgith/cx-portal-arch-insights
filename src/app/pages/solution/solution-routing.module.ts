import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolutionComponent } from './solution.component';

/**
 * Guidelines Module Routes
 */
const routes: Routes = [
	{
		children: [
			{
				loadChildren: './lifecycle/lifecycle.module#LifecycleModule',
				path: 'lifecycle',
			},
		],
		component: SolutionComponent,
		path: '',
	},
];

/**
 * Guidelines Routes Module
 */
export const SolutionRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
