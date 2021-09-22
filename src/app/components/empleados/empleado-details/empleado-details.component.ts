import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { EmpleadoCategoria } from 'src/app/models/empleado-categoria.model';
import { EmpleadoPuesto } from 'src/app/models/empleado-puesto.model';
import { Empleado, IEmpleado } from 'src/app/models/empleado.model';
import { EstadoCivil } from 'src/app/models/estado-civil.enum';
import { Genero } from 'src/app/models/genero.enum';
import { Direccion } from 'src/app/models/ubicacion.direccion.model';
import { EmpleadoCategoriaService } from 'src/app/services/empleado-categoria.service';
import { EmpleadoPuestoService } from 'src/app/services/empleado-puesto.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { DireccionDialogComponent } from '../../ubicaciones/direccion-dialog/direccion-dialog.component';
import { Observable } from 'rxjs';
import { SuccessDialogComponent } from 'src/app/layout/dialogs/success-dialog/success-dialog.component';
import { ContactoService } from 'src/app/services/contacto.service';
import { DireccionService } from 'src/app/services/ubicacion.service';
import { Contacto } from 'src/app/models/contacto.model';
import { EmpleadoDeleteComponent } from '../empleado-delete/empleado-delete.component';


@Component({
  selector: 'app-empleado-details',
  templateUrl: './empleado-details.component.html',
  styleUrls: ['./empleado-details.component.scss']
})
export class EmpleadoDetailsComponent implements OnInit {

  private dialogConfig!: MatDialogConfig<any>;

  empleadoSelect!: Empleado;
  empleadoForm!: FormGroup;

  isLoader!: Observable<Empleado>;

  genders = Object.values(Genero);
  maritalStatuss = Object.values(EstadoCivil);

  categorys!: EmpleadoCategoria[];
  positions!: EmpleadoPuesto[];

  address!: Direccion;
  addresShow!: string;

  constructor(
    private router: Router,
    private empleadoSvc: EmpleadoService,
    private contactoSvc: ContactoService,
    private direccionSvc: DireccionService,
    private activeRoute: ActivatedRoute,
    private categoriaSvc: EmpleadoCategoriaService,
    private puestoSvc: EmpleadoPuestoService,
    private dialog: MatDialog,
    private errorSvc: ErrorHandlerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadCategorys();
    this.loadPositions();
    this.getDetails();
    this.address = new Direccion;
    this.addresShow = 'Editar direccion';

    this.empleadoForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      dateOfBirth: new FormControl(new Date()),
      gender: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      maritalStatus: new FormControl('', [Validators.required]),
      dateStart: new FormControl(new Date()),
      cuil: new FormControl('', [Validators.maxLength(13)]),
      category: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      cellPhone: new FormControl('', [Validators.maxLength(10), Validators.maxLength(10)]),
      email: new FormControl('', [Validators.email]),
    });
  }

  getDetails(): void {
    let id: string = this.activeRoute.snapshot.params['id'];

    this.isLoader = this.empleadoSvc.get(id).pipe(
      tap((res: Empleado) => (

        this.empleadoForm.patchValue({
          firstName: res.nombre,
          lastName: res.apellido,
          dateOfBirth: this.toARString(res.nacimiento),
          gender: res.genero,
          dni: res.dni,
          maritalStatus: res.estadoCivil,
          dateStart: this.toARString(res.fechaAlta),
          cuil: res.cuil,
          category: res.categoria,
          position: res.puesto,
          address: this.setAddress(res.domicilio != null ? res.domicilio : new Direccion),
          cellPhone: res.contactoList[0].dato,
          email: res.contactoList[1].dato,
          info: res.info
        })
      ))
    );

    this.isLoader.subscribe(
      data => this.empleadoSelect = data
    );
  }

  //Para que mat-select tenga el valor inicial.
  compareObjects(o1: any, o2: any): boolean {
    return o1.nombre === o2.nombre;
  }

  //Para corregir diferencia de horario
  toARString(f: Date): string {
    let fecha = new Date(f);
    let localDateOffsetToUtc = fecha.getTimezoneOffset(); //the offset between the user local timezone with UTC. In my use case of Singapore, it give me -480.
    const offSetBetweenPSTAndUTC = 480;
    let offsetBetweenPSTAndLocal = offSetBetweenPSTAndUTC - localDateOffsetToUtc;
    let mins = offsetBetweenPSTAndLocal * 60 * 1000;
    let newDate = new Date(
      fecha.getTime() + mins
    );
    return newDate.toISOString();
  };

  updateEmppleado(empleadoValue: any): void {
    if (this.empleadoForm.valid) {
      this.executeUpdate(empleadoValue);
    }
  }

  private executeUpdate(empleadoValue: any): void {

    let empleado: IEmpleado = {
      firstName: empleadoValue.firstName,
      lastName: empleadoValue.lastName,
      dateOfBirth: empleadoValue.dateOfBirth,
      gender: empleadoValue.gender,
      dni: empleadoValue.dni,
      maritalStatus: empleadoValue.maritalStatus,
      address: this.address,
      dateStart: empleadoValue.dateStart,
      cuil: empleadoValue.cuil,
      category: empleadoValue.category,
      position: empleadoValue.position,
      info: empleadoValue.info,
      cellPhone: empleadoValue.cellPhone,
      email: empleadoValue.email,
    }

    let contacto: Contacto = this.empleadoSelect.contactoList[0];
    if (contacto.dato != empleadoValue.cellPhone) {
      contacto.dato = empleadoValue.cellPhone;
      this.contactoSvc.update(contacto.idContacto, contacto)
        .subscribe();
    }

    contacto = this.empleadoSelect.contactoList[1];
    if (contacto.dato != empleadoValue.email) {
      contacto.dato = empleadoValue.email;
      this.contactoSvc.update(contacto.idContacto, contacto)
        .subscribe();
    }

    if ((this.address.calle != this.empleadoSelect.domicilio.calle)
      || (this.address.numero != this.empleadoSelect.domicilio.numero)
      || (this.address.localidad.idLocalidad != this.empleadoSelect.domicilio.localidad.idLocalidad)) {
      this.direccionSvc.update(this.address.idDireccion, this.address).subscribe();
    }

    this.empleadoSvc.update(this.empleadoSelect.idPersona, empleado)
      .subscribe(
        res => {
          let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);
          //we are subscribing on the [mat-dialog-close] attribute as soon as we click on the dialog button
          dialogRef.afterClosed()
            .subscribe(result => {
              this.router.navigate(['/empleados/list'])
            });
        },
        (error => {
          this.errorSvc.dialogConfig = { ...this.dialogConfig };
          this.errorSvc.handleError(error);
        })
      )
  }

  openDireccionDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = this.address;
    const dialogRef = this.dialog.open(DireccionDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined) {
          this.setAddress(data)
        }
      }
    );
  }

  openDeleteDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = this.empleadoSelect;
    const dialogRef = this.dialog.open(EmpleadoDeleteComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined) {

          this.empleadoSvc.darBaja(data)
            .subscribe(
              res => {
                let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);
                //we are subscribing on the [mat-dialog-close] attribute as soon as we click on the dialog button
                dialogRef.afterClosed()
                  .subscribe(result => {
                    this.router.navigate(['/empleados/list'])
                  });
              },
              (error => {
                this.errorSvc.dialogConfig = { ...this.dialogConfig };
                this.errorSvc.handleError(error);
              })
            )

        }
      }
    );
  }

  private setAddress(ad: Direccion) {
    this.address = ad;
    this.addresShow = ad.calle + ' ' + ad.numero + ' - ' + ad.localidad.nombre;
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

  hasError(controlName: string, errorName: string) {
    return this.empleadoForm.controls[controlName].hasError(errorName);
  }

  onCancel(): void {
    this.router.navigate(['/empleados/list'])
  }

}
