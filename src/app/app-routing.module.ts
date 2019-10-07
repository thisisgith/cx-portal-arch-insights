import { ExtraOptions, Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientSSOGuard } from '@cisco-ngx/cui-auth';
import { UserResolve } from '@utilities';

/**
 * Representation of the routes used by @angular/router
 */
const routes: Routes = [
	{
		canActivate: [ClientSSOGuard],
		loadChildren: () => import('./pages/admin/admin.module')
			.then(m => m.AdminModule),
		path: 'admin',
		resolve: {
			user: UserResolve,
		},
	},
	{
		loadChildren: () => import('./pages/cases/cases.module')
			.then(m => m.CasesModule),
		path: 'cases',
		pathMatch: 'full',
	},
	{
		// canActivate: [ClientSSOGuard], TODO: Uncomment this
		loadChildren: () => import('./pages/setup-ie/setup-ie.module')
		 	.then(m => m.SetupIeModule),
		path: 'setup-ie',
		resolve: {
			user: UserResolve,
		},
	},
	{
		canActivate: [ClientSSOGuard],
		loadChildren: () => import('./pages/solution/solution.module')
			.then(m => m.SolutionModule),
		path: 'solution',
		resolve: {
			user: UserResolve,
		},
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
