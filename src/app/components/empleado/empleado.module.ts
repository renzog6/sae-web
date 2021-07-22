import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { EmpleadoRoutingModule } from "./empleado-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { EmpleadoComponent } from "./empleado.component";
import { EmpleadoListComponent } from "./empleado-list/empleado-list.component";
import { EmpleadoDetailComponent } from "./empleado-detail/empleado-detail.component";
import { EmpleadoEditComponent } from "./empleado-edit/empleado-edit.component";

@NgModule({
  declarations: [
    EmpleadoComponent,
    EmpleadoListComponent,
    EmpleadoDetailComponent,
    EmpleadoEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmpleadoRoutingModule,
    NgbModule,
  ],
  exports: [
    EmpleadoListComponent,
    EmpleadoDetailComponent,
    EmpleadoEditComponent
  ],
  providers: [],
})
export class EmpleadoModule {}
