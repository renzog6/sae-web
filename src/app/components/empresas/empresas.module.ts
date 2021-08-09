import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresasRoutingModule } from './empresas-routing.module';
import { EmpresasComponent } from './empresas.component';
import { EmpresaListComponent } from './empresa-list/empresa-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { EmpresaDetailsComponent } from './empresa-details/empresa-details.component';


@NgModule({
  declarations: [
    EmpresasComponent,
    EmpresaListComponent,
    EmpresaDetailsComponent
  ],
  imports: [
    CommonModule,
    EmpresasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class EmpresasModule { }
