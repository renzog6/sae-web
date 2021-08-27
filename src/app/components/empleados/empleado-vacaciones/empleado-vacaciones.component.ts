import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Empleado } from 'src/app/models/empleado.model';
import { IDiasDisponibles, Vacacion } from 'src/app/models/vacacion.models';
import { DateAuxService } from 'src/app/services/date-aux.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { VacacionService } from 'src/app/services/vacacion.services';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-empleado-vacaciones',
  templateUrl: './empleado-vacaciones.component.html',
  styleUrls: ['./empleado-vacaciones.component.scss']
})
export class EmpleadoVacacionesComponent implements OnInit {

  columnas: string[] = ['apellido', 'fechaAlta', 'antiguedad', 'diasDisponibles', 'categoria', 'details'];
  dataSource = new MatTableDataSource<Empleado>();
  diasXempleado!: IDiasDisponibles[];

  empleadoSelect!: Empleado;
  @Output() empleadoEvent = new EventEmitter<number>();
  idEmpleado: number = -1;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empleadoSvc: EmpleadoService,
    private vacacionSvc: VacacionService,
    private dateAuxSvc: DateAuxService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmpleados();
    this.loadDiasDisponibles();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private loadEmpleados(): void {
    this.empleadoSvc.getList().pipe(
      tap(
        (res: Empleado[]) => (this.dataSource.data = res)
      )
    ).subscribe();
  }

  private loadDiasDisponibles() {
    this.vacacionSvc.getDiasDisponibles().pipe(
      tap((res: IDiasDisponibles[]) => (this.diasXempleado = res))
    ).subscribe();
  }

  showVacaciones(empleado: Empleado): void {
    this.idEmpleado = empleado.idPersona;
  }

  getFullName(empleado: Empleado): string {
    return empleado.apellido + ' ' + empleado.nombre;
  }

  diasDisponibles(idEmpleado: number): number {
    let res;
    if (this.diasXempleado === null) {
      console.log('XXX')
    }
    res = this.diasXempleado && this.diasXempleado.filter(r => r.id === idEmpleado)[0];

    return res && res.dias;
  }

  filenames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };

  exportVacacion(): void {
    this.vacacionSvc.download(-1).subscribe(
      res => {
        console.log('SUB::: ', res);
        this.resportProgress(res);
        //saveAs(res, 'dsdsds.xlsx');
      },
      (error: HttpErrorResponse) => {
        console.log('ERROR::: ', error);
      },

    );
  }

  private resportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading... ');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading... ');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          this.fileStatus.status = 'done';
          for (const filename of httpEvent.body) {
            console.log('file:::', filename);
            this.filenames.unshift(filename);
          }
        } else {
          console.log('ELSE:::', httpEvent.headers);
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8` }));
          //  saveAs(new Blob([httpEvent.body!],
          //     { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}),
          //      httpEvent.headers.get('File-Name'));
        }
        this.fileStatus.status = 'done';
        break;
      default:
        console.log(httpEvent);
        break;

    }
  }

  private updateStatus(loaded: number, total: number, requestType: string): void {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }

  calcAntiguedad(fecha: string): number {
    return this.dateAuxSvc.calcAntiguedad(fecha);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectedRow: any;
  onClickedRow(row: any) {
    this.showVacaciones(row);
    this.selectedRow = row;
  }

  ngOnDestroy(): void {
    console.log("Chau...");
  }
}
