import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosVacacionesRoutingModule } from './empleado-vacaciones-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/layout/shared.module';
import { EmpleadoVacacionesComponent } from './empleado-vacaciones.component';
import { VacacionListComponent } from './vacacion-list/vacacion-list.component';
import { VacacionCreateComponent } from './vacacion-create/vacacion-create.component';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [
    EmpleadoVacacionesComponent,
    VacacionListComponent,
    VacacionCreateComponent
  ],
  imports: [
    CommonModule,
    EmpleadosVacacionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule
  ]
})
export class EmpleadosVacaionesModule { }
