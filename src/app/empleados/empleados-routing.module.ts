import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmpleadosComponent } from './empleados.component';
import { EmpleadosListComponent } from './empleados-list/empleados-list.component';
import { EmpleadosDetailComponent } from './empleados-detail/empleados-detail.component';

import { Page404Component } from '../home/page404/page404.component';

const routes: Routes = [
  {
    path: '', component: EmpleadosComponent, children: [
      {
        path: 'lista', component: EmpleadosListComponent
      }, {
        path: 'detail/:id', component: EmpleadosDetailComponent
      },  {
        path: 'detail', component: EmpleadosDetailComponent
      }, {
        path: '', redirectTo: 'lista', pathMatch: 'full'
      }, {
         path: '**', component: Page404Component 
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadosRoutingModule { }
