import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Representation of the routes used by @angular/router
 */
const routes: Routes = [];

/**
 * Base routing module for the application
 */
@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }
