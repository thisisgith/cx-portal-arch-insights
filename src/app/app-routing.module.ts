import { ExtraOptions, Routes, RouterModule } from '@angular/router';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ClientSSOGuard } from '@cisco-ngx/cui-auth';

/**
 * SSO Guard
 * @returns canActive
 * @param clientSSOGuard as input
 */
export function startupServiceFactory (clientSSOGuard: ClientSSOGuard) {
	return () => clientSSOGuard.canActivate()
		.toPromise();
}

/**
 * Representation of the routes used by @angular/router
 */
const routes: Routes = [
	{
		loadChildren: './pages/solution/solution.module#SolutionModule',
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
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: startupServiceFactory,
			deps: [ClientSSOGuard],
			multi: true,
		},
	],
})
export class AppRoutingModule { }
