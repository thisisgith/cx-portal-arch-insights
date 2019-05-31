import { ExtraOptions, Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientSSOGuard } from '@cisco-ngx/cui-auth';

/**
 * Representation of the routes used by @angular/router
 */
const routes: Routes = [
	{
		loadChildren: () => import('./pages/admin/admin.module')
		 	.then(m => m.AdminModule),
		path: 'admin',
	},
	{
		loadChildren: () => import('./pages/cases/cases.module')
			.then(m => m.CasesModule),
		path: 'cases',
		pathMatch: 'full',
	},
	{
		canActivate: [ClientSSOGuard],
		loadChildren: () => import('./pages/solution/solution.module')
			.then(m => m.SolutionModule),
		path: 'solution',
	},
	{
		path: '**',
		redirectTo: 'solution',
	},
];

/**
 * ExtraOptions[https://angular.io/api/router/ExtraOptions]
 */
const routerOptions: ExtraOptions = {
	enableTracing: false,
};

/**
 * App Routing Module
 */
@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forRoot(routes, routerOptions)],
})
export class AppRoutingModule { }
