import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
    FormsModule,
    ReactiveFormsModule,
    EmpleadoRoutingModule
  ],
  exports:[
    EmpleadoListComponent,
    EmpleadoDetailComponent
  ]
})
export class EmpleadoModule { }
