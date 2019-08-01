import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsightsComponent } from './insights.component';

/**
 * Guidelines Module Routes
 */
const routes: Routes = [
	{
		children: [
			{
				loadChildren: () => import('../osv/osv.module')
					.then(m => m.OsvModule),
				path: 'compliance',
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'risk-mitigation',
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'fault-management',
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'configuration',
			}, {
				loadChildren: () => import('../osv/osv.module')
					.then(m => m.OsvModule),
				path: 'osv',
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'architecture',
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'syslogs',
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
