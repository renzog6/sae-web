import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadoCreateComponent } from './empleado-create/empleado-create.component';
import { EmpleadoDetailsComponent } from './empleado-details/empleado-details.component';
import { EmpleadoListComponent } from './empleado-list/empleado-list.component';
import { EmpleadosComponent } from './empleados.component';

const routes: Routes = [
  {
    path: '', component: EmpleadosComponent,
    children: [
      { path: 'list', component: EmpleadoListComponent },
      { path: 'details', component: EmpleadoDetailsComponent },
      { path: 'create', component: EmpleadoCreateComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
