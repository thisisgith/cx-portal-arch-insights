import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchitectureComponent } from './architecture.component';

const routes: Routes = [
  {  path: '', component: ArchitectureComponent },
];

/** Module to represent the Architecture Routing */
@NgModule({
	exports: [RouterModule],
	imports: [RouterModule.forChild(routes)],
})
export class ArchitectureRoutingModule { }
