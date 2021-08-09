import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { EmpleadosComponent } from './empleados.component';
import { EmpleadoListComponent } from './empleado-list/empleado-list.component';
import { EmpleadoDetailsComponent } from './empleado-details/empleado-details.component';
import { EmpleadoCreateComponent } from './empleado-create/empleado-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/layout/shared.module';


@NgModule({
  declarations: [
    EmpleadosComponent,
    EmpleadoListComponent,
    EmpleadoDetailsComponent,
    EmpleadoCreateComponent
  ],
  imports: [
    CommonModule,
    EmpleadosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class EmpleadosModule { }
