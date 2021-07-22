import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EmpresaRoutingModule } from "./empresa-routing.module";
import { EmpresaComponent } from "./empresa.component";
import { EmpresaListComponent } from "./empresa-list/empresa-list.component";
import { EmpresaDetailComponent } from "./empresa-detail/empresa-detail.component";

@NgModule({
  declarations: [
    EmpresaComponent,
    EmpresaListComponent,
    EmpresaDetailComponent,
  ],
  imports: [CommonModule, EmpresaRoutingModule],
  exports: [EmpresaComponent, EmpresaListComponent, EmpresaDetailComponent],
})
export class EmpresaModule {}
