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
				path: 'osv',
			}, {
				loadChildren: () => import('../risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'risk-mitigation',
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
