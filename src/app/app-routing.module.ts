import { NgModule } from '@angular/core';
import { ExtraOptions, Routes, RouterModule } from '@angular/router';

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
})
export class AppRoutingModule { }
