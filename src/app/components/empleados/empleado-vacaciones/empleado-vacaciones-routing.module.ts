import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadoVacacionesComponent } from './empleado-vacaciones.component';
import { VacacionCreateComponent } from './vacacion-create/vacacion-create.component';
import { VacacionDeleteComponent } from './vacacion-delete/vacacion-delete.component';
import { VacacionListComponent } from './vacacion-list/vacacion-list.component';


const routes: Routes = [
  {
    path: '', component: EmpleadoVacacionesComponent,
    children: [
      { path: 'list', component: VacacionListComponent },
      { path: 'create', component: VacacionCreateComponent },
      { path: 'delete/:id', component: VacacionDeleteComponent },
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosVacacionesRoutingModule { }
