import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosVacacionesRoutingModule } from './empleado-vacaciones-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/layout/shared.module';
import { EmpleadoVacacionesComponent } from './empleado-vacaciones.component';
import { VacacionListComponent } from './vacacion-list/vacacion-list.component';
import { VacacionCreateComponent } from './vacacion-create/vacacion-create.component';
import { MaterialModule } from 'src/app/material.module';
import { SumPipeModule } from './sum.pipe';
import { VacacionDeleteComponent } from './vacacion-delete/vacacion-delete.component';

@NgModule({
  declarations: [
    EmpleadoVacacionesComponent,
    VacacionListComponent,
    VacacionCreateComponent,
    VacacionDeleteComponent
  ],
  imports: [
    CommonModule,
    EmpleadosVacacionesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    SumPipeModule
  ],
  providers: [SumPipeModule]
})
export class EmpleadosVacaionesModule { }
