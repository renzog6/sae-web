import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { OwnerForCreation } from 'src/app/models/owens.model';
import { SuccessDialogComponent } from 'src/app/layout/dialogs/success-dialog/success-dialog.component';
import { Empleado, IEmpleado } from 'src/app/models/empleado.model';
import { Genero } from 'src/app/models/genero.enum';
import { EstadoCivil } from 'src/app/models/estado-civil.enum';
import { EmpleadoCategoriaService } from 'src/app/services/empleado-categoria.service';
import { EmpleadoPuestoService } from 'src/app/services/empleado-puesto.service';
import { EmpleadoCategoria } from 'src/app/models/empleado-categoria.model';
import { EmpleadoPuesto } from 'src/app/models/empleado-puesto.model';


@Component({
  selector: 'app-empleado-create',
  templateUrl: './empleado-create.component.html',
  styleUrls: ['./empleado-create.component.scss']
})
export class EmpleadoCreateComponent implements OnInit, OnDestroy {

  empleado!: FormGroup;
  private dialogConfig!: MatDialogConfig<any>;

  genders = Object.values(Genero);
  maritalStatuss = Object.values(EstadoCivil);

  categorys!: EmpleadoCategoria[];
  positions!: EmpleadoPuesto[];

  constructor(
    private location: Location,
    private empleadoSvc: EmpleadoService,
    private categoriaSvc: EmpleadoCategoriaService,
    private puestoSvc: EmpleadoPuestoService,
    private dialog: MatDialog,
    private errorSvc: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.loadCategorys();
    this.loadPositions();

    this.empleado = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      dateOfBirth: new FormControl(new Date()),
      gender: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      maritalStatus: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      dateStart: new FormControl(new Date()),
      cuil: new FormControl('', [Validators.maxLength(13)]),
      category: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
    });
    //email
    //Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {}
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.empleado.controls[controlName].hasError(errorName);
  }

  onCancel(): void {
    this.location.back();
  }

  createEmppleado(empleadoValue: any): void {
    if (this.empleado.valid) {
      this.executeOwnerCreation(empleadoValue);
    }
  }

  private executeOwnerCreation(empleadoValue: any): void {

    let empleado: IEmpleado = {
      firstName: empleadoValue.firstName,
      lastName: empleadoValue.lastName,
      dateOfBirth: empleadoValue.dateOfBirth,
      gender: empleadoValue.gender,
      dni: empleadoValue.dni,
      maritalStatus: empleadoValue.maritalStatus,
      address: empleadoValue.address,
      dateStart: empleadoValue.dateStart,
      cuil: empleadoValue.cuil,
      category: empleadoValue.category,
      position: empleadoValue.position,
      info: empleadoValue.info
    }

    this.empleadoSvc.create(empleado)
      .subscribe(
        res => {
          let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);
          //we are subscribing on the [mat-dialog-close] attribute as soon as we click on the dialog button
          dialogRef.afterClosed()
            .subscribe(result => {
              this.location.back();
            });
        },
        (error => {
          this.errorSvc.dialogConfig = { ...this.dialogConfig };
          this.errorSvc.handleError(error);
        })
      )
  }

  loadPositions(): void {
    this.puestoSvc.getAll().pipe().subscribe(
      res => (this.positions = res)
    );
  }

  loadCategorys(): void {
    this.categoriaSvc.getAll().pipe().subscribe(
      res => (this.categorys = res)
    );
  }

  ngOnDestroy() {
    console.log("CHAUUU::::::")
  }

}
