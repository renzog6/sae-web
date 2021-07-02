import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

import { EmpleadosComponent } from './empleados.component';
import { EmpleadosListComponent } from './empleados-list/empleados-list.component';
import { EmpleadosDetailComponent } from './empleados-detail/empleados-detail.component';

@NgModule({
  declarations: [
    EmpleadosComponent,
    EmpleadosListComponent,
    EmpleadosDetailComponent

  ],
  imports: [
    CommonModule,
    EmpleadosRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    NgbModule
  ]
})
export class EmpleadosModule { }
