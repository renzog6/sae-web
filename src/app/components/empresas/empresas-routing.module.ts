import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmpresaDetailsComponent } from './empresa-details/empresa-details.component';
import { EmpresaListComponent } from './empresa-list/empresa-list.component';
import { EmpresasComponent } from './empresas.component';

const routes: Routes = [
  {
    path: '', component: EmpresasComponent,
    children: [
      { path: 'list', component: EmpresaListComponent },
      { path: 'details', component: EmpresaDetailsComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule { }
