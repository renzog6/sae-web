import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDetailVacation, Vacacion } from 'src/app/models/vacacion.models';
import { VacacionService } from 'src/app/services/vacacion.services';

@Component({
  selector: 'app-vacacion-create',
  templateUrl: './vacacion-create.component.html',
  styleUrls: ['./vacacion-create.component.scss']
})
export class VacacionCreateComponent implements OnInit {

  form!: FormGroup;
  vacacion!: Vacacion;
  isDataAvailable: boolean = false;
  isNuevaVacaccion: boolean = false;

  detailVacacion: IDetailVacation[] = [
    { name: 'Toma Vacaciones', value: -1 },
    { name: 'Nuevas Vacaciones', value: 1 },
  ];
  selectedDetailVacation = this.detailVacacion[0];

  constructor(
    private dialogRef: MatDialogRef<VacacionCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Vacacion,
    private formBuilder: FormBuilder,
    private vacacionSrv: VacacionService,
    private router: Router,
  ) {
    this.vacacion = data;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecha: new FormControl(new Date(), [Validators.required]),
      detalle: new FormControl(this.selectedDetailVacation),
      dias: new FormControl(this.vacacion.dias ? this.vacacion.dias : '', [Validators.required]),
      anio: new FormControl(this.vacacion.anio ? this.vacacion.anio : '', [Validators.required]),
      fechaToma: new FormControl(new Date(), [Validators.required]),
      info: new FormControl(this.vacacion.info ? this.vacacion.info : ''),
    });
  }

  create(value: any): void {
    if (this.form.valid) {
      this.executeCreation(value);
    }
  }

  private executeCreation(vacacionValue: any): void {
    let vaca = new Vacacion();
    vaca.detalle = vacacionValue.detalle.name + " " + vacacionValue.anio;
    vaca.dias = vacacionValue.dias * vacacionValue.detalle.value;
    vaca.anio = vacacionValue.anio;
    vaca.info = vacacionValue.info;

    if (vacacionValue.detalle.value === 1) {
      let date = new Date();
      //date.setDate(31);
      //date.setMonth(12);
      date.setFullYear(vacacionValue.anio, 11, 31);
      console.log(date);
      vaca.fecha = date;
      vaca.fechaToma = date;

    } else {
      vaca.fecha = vacacionValue.fecha;
      vaca.fechaToma = vacacionValue.fechaToma;
    }

    console.log(vaca);
    this.dialogRef.close(vaca);
  }

  hasError(controlName: string, errorName: string) {
    return this.form.controls[controlName].hasError(errorName);
  }

  onChange(): void {
    console.log(this.isNuevaVacaccion)
    if (this.isNuevaVacaccion) {
      this.isNuevaVacaccion = false;
    } else {
      this.isNuevaVacaccion = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.router.navigate(['/empleados/vacaciones'])
  }

}
