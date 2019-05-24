import { ExtraOptions, Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientSSOGuard } from '@cisco-ngx/cui-auth';

/**
 * Representation of the routes used by @angular/router
 */
const routes: Routes = [
	{
		loadChildren: './pages/cases/cases.module#CasesModule',
		path: 'cases',
		pathMatch: 'full',
	},
	{
		loadChildren: './pages/solution/solution.module#SolutionModule',
		canActivate: [ClientSSOGuard],
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
