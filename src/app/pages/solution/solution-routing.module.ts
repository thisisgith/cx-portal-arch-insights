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
				loadChildren: () => import('./best-practices/best-practices.module')
					.then(m => m.BestPracticesModule),
				path: 'bp',
			},
			{
				loadChildren: () => import('./lifecycle/lifecycle.module')
					.then(m => m.LifecycleModule),
				path: 'lifecycle',
			},
			{
				loadChildren: () => import('./assets/assets.module')
					.then(m => m.AssetsModule),
				path: 'assets',
			},
			{
				loadChildren: () => import('./security/security.module')
					.then(m => m.SecurityModule),
				path: 'security',
			},
			{
				loadChildren: () => import('./advisories/advisories.module')
					.then(m => m.AdvisoriesModule),
				path: 'advisories',
			},
			{
				loadChildren: () => import('./resolution/resolution.module')
					.then(m => m.ResolutionModule),
				path: 'resolution',
			},			
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'lifecycle',
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
