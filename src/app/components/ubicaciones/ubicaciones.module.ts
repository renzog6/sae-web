import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DireccionDialogComponent } from './direccion-dialog/direccion-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';



@NgModule({
  declarations: [
    DireccionDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class UbicacionesModule { }
