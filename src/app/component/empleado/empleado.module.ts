import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadoRoutingModule } from './empleado-routing.module';
import { EmpleadoListComponent } from './empleado-list/empleado-list.component';
import { EmpleadoDetailComponent } from './empleado-detail/empleado-detail.component';


@NgModule({
  declarations: [
    EmpleadoListComponent,
    EmpleadoDetailComponent
  ],
  imports: [
    CommonModule,
    EmpleadoRoutingModule
  ],
  exports:[
    EmpleadoListComponent,
    EmpleadoDetailComponent
  ]
})
export class EmpleadoModule { }
