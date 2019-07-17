import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BestPracticesComponent } from './best-practices.component';

/**
 * BestPractices Module Routes
 */
const routes: Routes = [
	{
		children: [
			{
				loadChildren: () => import('./osv/osv.module')
					.then(m => m.OptimalSoftwareVersionModule),
				path: 'optimal-software-version',
			},
			{
				loadChildren: () => import('./architecture/architecture.module')
					.then(m => m.ArchitectureModule),
				path: 'architecture',
			},
			{
				loadChildren: () => import('./risk-mitigation/risk-mitigation.module')
					.then(m => m.RiskMitigationModule),
				path: 'risk-mitigation',
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'optimal-software-version',
			},
		],
		component: BestPracticesComponent,
		path: '',
	},
];

/**
 * BestPractices Routes Module
 */
export const BestPracticesRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
