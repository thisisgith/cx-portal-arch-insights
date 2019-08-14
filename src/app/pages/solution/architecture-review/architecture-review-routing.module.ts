import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchitectureReviewComponent } from './architecture-review.component';

const routes: Routes = [
  {  path: '', component: ArchitectureReviewComponent },
];

/** Module to represent the Architecture Routing */
@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forChild(routes)],
})
export class ArchitectureReviewRoutingModule { }
