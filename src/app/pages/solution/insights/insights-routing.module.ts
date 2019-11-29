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
				loadChildren: '../rcc/rcc.module#RccModule',
				path: 'compliance',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: '../risk-mitigation/risk-mitigation.module#RiskMitigationModule',
				path: 'risk-mitigation',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: '../osv/osv.module#OptimalSoftwareVersionModule',
				path: 'osv',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: '../architecture/architecture.module#ArchitectureModule',
				path: 'architecture',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: '../syslogs/syslogs.module#SyslogsModule',
				path: 'syslogs',
				resolve: {
					user: UserResolve,
				},
			}, {
				loadChildren: '../architecture-review/architecture-review.module#ArchitectureReviewModule',
				path: 'architecture-review',
				resolve: {
					user: UserResolve,
				},
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'osv',
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
