import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Representation of the routes used by @angular/router
 */
const routes: Routes = [
	{
		loadChildren: './pages/inventory/inventory.module#InventoryModule',
		path: '',
		pathMatch: 'full',
	},
	{
		loadChildren: './pages/solution/solution.module#SolutionModule',
		path: 'solutions',
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: '',
	},
];

/**
 * Base routing module for the application
 */
@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
