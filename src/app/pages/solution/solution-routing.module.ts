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
			{
				loadChildren: './assets/assets.module#AssetsModule',
				path: 'assets',
			},
			{
				loadChildren: './security/security.module#SecurityModule',
				path: 'security',
			},
			{
				loadChildren: './advisories/advisories.module#AdvisoriesModule',
				path: 'advisories',
			},
			{
				loadChildren: './resolution/resolution.module#ResolutionModule',
				path: 'resolution',
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
