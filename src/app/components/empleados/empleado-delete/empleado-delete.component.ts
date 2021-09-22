import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado-delete',
  templateUrl: './empleado-delete.component.html',
  styleUrls: ['./empleado-delete.component.scss']
})
export class EmpleadoDeleteComponent implements OnInit {

  formBaja!: FormGroup;
  empleado!: Empleado;

  constructor(
    private dialogRef: MatDialogRef<EmpleadoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Empleado,
    private formBuilder: FormBuilder,
  ) {
    this.empleado = data;
  }

  ngOnInit(): void {

    this.formBaja = this.formBuilder.group({
      fechaBaja: new FormControl(new Date()),
      info: new FormControl(this.empleado.info, [Validators.required, Validators.maxLength(50)]),
    });

  }

  onDelete(empleadoValue: any): void {
    if (this.formBaja.valid) {
      this.empleado.fechaBaja = empleadoValue.fechaBaja;
      this.empleado.info = empleadoValue.info;
      this.dialogRef.close(this.empleado);
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.formBaja.controls[controlName].hasError(errorName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
