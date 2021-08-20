import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { delay, map, startWith, tap } from 'rxjs/operators';
import { Direccion, IDireccion } from 'src/app/models/ubicacion.direccion.model';
import { Localidad } from 'src/app/models/ubicacion.localidad.model';
import { LocalidadService } from 'src/app/services/ubicacion.service';



@Component({
  selector: 'app-direccion-dialog',
  templateUrl: './direccion-dialog.component.html',
  styleUrls: ['./direccion-dialog.component.scss']
})
export class DireccionDialogComponent implements OnInit {

  formAddress!: FormGroup;
  direccion!: Direccion;

  myControl = new FormControl('', [Validators.required]);
  options: Localidad[] = [];
  filteredOptions!: Observable<Localidad[]>;

  isDataAvailable: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<DireccionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Direccion,
    private localidadSvc: LocalidadService,
    private formBuilder: FormBuilder,
  ) {
    this.direccion = data;
  }

  ngOnInit(): void {
    this.loadCitys();

    console.log('ngOnInit', this.direccion.localidad);


    this.formAddress = this.formBuilder.group({
      street: new FormControl(this.direccion.calle, [Validators.required, Validators.maxLength(20)]),
      number: new FormControl(this.direccion.numero, [Validators.required, Validators.maxLength(5)]),
      info: new FormControl(this.direccion.info ? this.direccion.info : '', [Validators.maxLength(20)]),
      city: this.myControl,
    });
    this.myControl.setValue(this.direccion.localidad ? this.direccion.localidad : '');

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | Localidad>(''),
        map(value => typeof value === 'string' ? value : value.nombre),
        map(nombre => nombre ? this._filter(nombre) : this.options.slice())
      );
    this.displayFn(this.direccion.localidad);
  }

  displayFn(localidad?: Localidad): string {
    return localidad ? localidad.nombre : '';
  }

  private _filter(nombre: string): Localidad[] {
    const filterValue = nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  create(empleadoValue: any): void {
    if (this.formAddress.valid) {
      this.executeCreation(empleadoValue);
    }
  }

  private executeCreation(empleadoValue: any): void {
    this.direccion.calle = empleadoValue.street;
    this.direccion.numero = empleadoValue.number;
    this.direccion.info = empleadoValue.info
    this.direccion.localidad = empleadoValue.city;

    this.dialogRef.close(this.direccion);
  }

  hasError(controlName: string, errorName: string) {
    return this.formAddress.controls[controlName].hasError(errorName);
  }

  loadCitys(): void {
    this.localidadSvc.getList().pipe(
      tap((res: Localidad[]) => (this.options = res)),
    ).subscribe();
    this.isDataAvailable = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
