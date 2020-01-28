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
				data: {
					title: '_Lifecycle_',
				},
			},
			{
				loadChildren: () => import('./assets/assets.module')
					.then(m => m.AssetsModule),
				path: 'assets/:view',
				resolve: {
					user: UserResolve,
				},
				data: {
					title: '_Assets&Coverage_',
				},
			},
			{
				path: 'assets',
				pathMatch: 'full',
				redirectTo: 'assets/system',
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
				data: {
					title: '_Advisories_',
				},
			},
			{
				loadChildren: () => import('./advisories/advisories.module')
					.then(m => m.AdvisoriesModule),
				path: 'advisories/:advisory',
				resolve: {
					user: UserResolve,
				},
				data: {
					title: '_Advisories_',
				},
			},
			{
				loadChildren: () => import('./resolution/resolution.module')
					.then(m => m.ResolutionModule),
				path: 'resolution',
				resolve: {
					user: UserResolve,
				},
				data: {
					title: '_ProblemResolution_',
				},
			},
			{
				loadChildren: () => import('./insights/insights.module')
					.then(m => m.InsightsModule),
				path: 'insights',
				resolve: {
					user: UserResolve,
				},
				data: {
					title: '_Insights_',
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
