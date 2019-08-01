import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolutionComponent } from './solution.component';
import { UserResolve } from '@utilities';

/**
 * Guidelines Module Routes
 */
const routes: Routes = [
	{
		children: [
			{
				loadChildren: () => import('./lifecycle/lifecycle.module')
					.then(m => m.LifecycleModule),
				path: 'lifecycle',
				resolve: {
					user: UserResolve,
				},
			},
			{
				loadChildren: () => import('./assets/assets.module')
					.then(m => m.AssetsModule),
				path: 'assets',
				resolve: {
					user: UserResolve,
				},
			},
			{
				loadChildren: () => import('./security/security.module')
					.then(m => m.SecurityModule),
				path: 'security',
				resolve: {
					user: UserResolve,
				},
			},
			{
				path: 'advisories',
				pathMatch: 'full',
				redirectTo: 'advisories/security',
			},
			{
				loadChildren: () => import('./advisories/advisories.module')
					.then(m => m.AdvisoriesModule),
				path: 'advisories/:advisory',
				resolve: {
					user: UserResolve,
				},
			},
			{
				loadChildren: () => import('./resolution/resolution.module')
					.then(m => m.ResolutionModule),
				path: 'resolution',
				resolve: {
					user: UserResolve,
				},
			},
			{
				loadChildren: () => import('./insights/insights.module')
					.then(m => m.InsightsModule),
				path: 'insights',
				resolve: {
					user: UserResolve,
				},
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
