import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpleadoListComponent } from './empleado-list/empleado-list.component';
import { EmpleadoDetailComponent } from './empleado-detail/empleado-detail.component';
import { EmpleadoEditComponent } from './empleado-edit/empleado-edit.component';
import { EmpleadoComponent } from './empleado.component';
import { ErrorComponent } from 'src/app/home/error/error.component';

const routes: Routes = [
  {
    path: '',
    component: EmpleadoComponent,
    children: [
      { path: 'list', component: EmpleadoListComponent },
      { path: 'list/:id', component: EmpleadoDetailComponent },
      { path: 'add', component: EmpleadoEditComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', component: ErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleadoRoutingModule {}
