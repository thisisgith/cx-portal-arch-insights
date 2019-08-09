import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsightsComponent } from './insights.component';
import { UserResolve } from '@utilities';

/**
 * Guidelines Module Routes
 */
const routes: Routes = [
	{
		children: [
			{
				loadChildren: () => import('../osv/osv.module')
				.then(m => m.OptimalSoftwareVersionModule),
				path: 'compliance',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'risk-mitigation',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'fault-management',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'configuration',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: () => import('../osv/osv.module')
					.then(m => m.OptimalSoftwareVersionModule),
				path: 'osv',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'architecture',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'syslogs',
				resolve: {
					user: UserResolve,
				},
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'compliance',
			},
		],
		component: InsightsComponent,
		path: '',
	},
];

/**
 * Guidelines Routes Module
 */
export const InsightsRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
