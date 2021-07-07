import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaListComponent } from './empresa-list/empresa-list.component';
import { EmpresaDetailComponent } from './empresa-detail/empresa-detail.component';


@NgModule({
  declarations: [
    EmpresaListComponent,
    EmpresaDetailComponent
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule
  ],
  exports: [
  EmpresaListComponent,
  EmpresaDetailComponent]
})
export class EmpresaModule { }
