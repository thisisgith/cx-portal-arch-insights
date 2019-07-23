import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchitectureComponent } from './architecture.component';
import { CbpRuleViolationComponent } from './cbp-rule-violation/cbp-rule-violation.component';
import { DevicesWithExceptionsComponent } from './devices-with-exceptions/devices-with-exceptions.component';

const routes: Routes = [
  {
    path: '',
    component: ArchitectureComponent,
    children: [
      { path: 'Exceptions',
         component: CbpRuleViolationComponent,
      },
      { path: 'AssetsWithExceptions',
         component: DevicesWithExceptionsComponent,
      },
    ],
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class ArchitectureRoutingModule {}