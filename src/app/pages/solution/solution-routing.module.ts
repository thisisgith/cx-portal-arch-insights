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
				loadChildren: './lifecycle/lifecycle.module#LifecycleModule',
				path: 'lifecycle',
				resolve: {
					user: UserResolve,
				},
			},
			{
				loadChildren: './assets/assets.module#AssetsModule',
				path: 'assets/:view',
				resolve: {
					user: UserResolve,
				},
			},
			{
				path: 'assets',
				pathMatch: 'full',
				redirectTo: 'assets/system',
			},
			{
				loadChildren: './security/security.module#SecurityModule',
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
				loadChildren: './advisories/advisories.module#AdvisoriesModule',
				path: 'advisories/:advisory',
				resolve: {
					user: UserResolve,
				},
			},
			{
				loadChildren: './resolution/resolution.module#ResolutionModule',
				path: 'resolution',
				resolve: {
					user: UserResolve,
				},
			},
			{
				loadChildren: './insights/insights.module#InsightsModule',
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
