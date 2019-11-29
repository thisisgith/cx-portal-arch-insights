import { ExtraOptions, Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientSSOGuard } from '@cisco-ngx/cui-auth';
import { EntitlementRouteAuthService } from '@services';
import { UserResolve } from '@utilities';
import { UserRoles } from '@constants';

/**
 * Representation of the routes used by @angular/router
 */
const routes: Routes = [
	{
		canActivate: [ClientSSOGuard, EntitlementRouteAuthService],
		loadChildren: './pages/admin/admin.module#AdminModule',
		path: 'admin',
		resolve: {
			user: UserResolve,
		},
		data: {
			auth: {
				whitelistRoles: UserRoles.ADMIN,
				redirectUrl: '/solution',
			},
		},
	},
	{
		loadChildren: './pages/cases/cases.module#CasesModule',
		path: 'cases',
		pathMatch: 'full',
	},
	{
		canActivate: [ClientSSOGuard],
		loadChildren: './pages/setup-ie/setup-ie.module#SetupIeModule',
		path: 'setup-ie',
		resolve: {
			user: UserResolve,
		},
	},
	{
		canActivate: [ClientSSOGuard],
		loadChildren: './pages/solution/solution.module#SolutionModule',
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
	onSameUrlNavigation: 'reload',
};

/**
 * App Routing Module
 */
@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forRoot(routes, routerOptions)],
})
export class AppRoutingModule { }
