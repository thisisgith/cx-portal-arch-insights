import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Representation of the routes used by @angular/router
 */
const routes: Routes = [
	{
		loadChildren: './pages/solution/solution.module#SolutionModule',
		path: '',
		pathMatch: 'full',
	},
	{
		loadChildren: './pages/inventory/inventory.module#InventoryModule',
		path: 'metrics',
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
