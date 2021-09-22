import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { SuccessDialogComponent } from 'src/app/layout/dialogs/success-dialog/success-dialog.component';
import { Vacacion } from 'src/app/models/vacacion.models';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { VacacionService } from 'src/app/services/vacacion.services';
import { VacacionCreateComponent } from '../vacacion-create/vacacion-create.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { VacacionDeleteComponent } from '../vacacion-delete/vacacion-delete.component';
import { HttpErrorResponse, HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-vacacion-list',
  templateUrl: './vacacion-list.component.html',
  styleUrls: ['./vacacion-list.component.scss']
})
export class VacacionListComponent implements OnInit {

  private dialogConfig!: MatDialogConfig<any>;

  totalDias: number = 0;
  vacacionSelect!: Vacacion;

  @Input() idEmpleado!: number;
  ngOnChanges(changes: SimpleChanges) {
    this.loadVacaciones(changes.idEmpleado.currentValue);
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['fecha', 'detalle', 'dias', 'anio', 'fechaToma', 'info', 'print', 'delete'];
  dataSource = new MatTableDataSource<Vacacion>();

  constructor(
    private vacacionSvc: VacacionService,
    private dialog: MatDialog,
    private errorSvc: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {}
    }
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadVacaciones(id: number): void {
    if (id != -1) {
      this.dataSource.data = [];
      this.vacacionSvc.getListByEmpleado(id).pipe(
        tap((res: Vacacion[]) => (this.dataSource.data = res)),
        tap((res: Vacacion[]) => (this.totalDias = res.map(t => t.dias).reduce((acc, value) => acc + value, 0))),
      ).subscribe();
    } else {
      this.dataSource.data = [];
    }
  }

  getTotalDias(): number {
    return this.totalDias;
  }

  printVacacion(vaca: Vacacion): void {

    this.vacacionSvc.downloadPDF(vaca.idVacacion).subscribe(
      (httpEvent: HttpEvent<Blob>) => {
        if (httpEvent.type === 4) {
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8` }));
        }
      },
      (error: HttpErrorResponse) => {
        console.log('ERROR::: ', error);
      },
    );
  }

  exportVacacion(): void {
    this.vacacionSvc.download(this.idEmpleado).subscribe(
      (httpEvent: HttpEvent<Blob>) => {
        if (httpEvent.type === 4) {
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8` }));
        }
      },
      (error: HttpErrorResponse) => {
        console.log('ERROR::: ', error);
      },
    );
  }

  deleteVacacion(vaca: Vacacion): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = vaca;

    const dialogRef = this.dialog.open(VacacionDeleteComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        this.loadVacaciones(this.idEmpleado);
      }
    );
  }

  openCreateVacacion(isCreate: boolean): void {

    if (isCreate) {
      this.vacacionSelect = new Vacacion();
    }
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = this.vacacionSelect;

    const dialogRef = this.dialog.open(VacacionCreateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined) {
          this.vacacionSelect = data
          this.vacacionSvc.create(this.idEmpleado, data)
            .subscribe(
              res => {
                let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);
                //we are subscribing on the [mat-dialog-close] attribute as soon as we click on the dialog button
                dialogRef.afterClosed()
                  .subscribe(result => {
                    this.router.navigate(['/empleados/vacaciones']).then(() => {
                      window.location.reload()
                    }),
                      this.loadVacaciones(this.idEmpleado)
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

}
