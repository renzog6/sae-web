import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ComplexOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { tap } from 'rxjs/operators';
import { Empleado } from 'src/app/models/empleado.model';
import { Vacacion } from 'src/app/models/vacacion.models';
import { DateAuxService } from 'src/app/services/date-aux.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { VacacionService } from 'src/app/services/vacacion.services';

@Component({
  selector: 'app-empleado-vacaciones',
  templateUrl: './empleado-vacaciones.component.html',
  styleUrls: ['./empleado-vacaciones.component.scss']
})
export class EmpleadoVacacionesComponent implements OnInit {

  columnas: string[] = ['apellido', 'fechaAlta', 'antiguedad', 'diasDisponibles', 'categoria', 'details'];
  dataSource = new MatTableDataSource<Empleado>();

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

  showVacaciones(empleado: Empleado): void {
    console.log('ID::::', empleado.idPersona)
    this.idEmpleado = empleado.idPersona;
    //this.empleadoEvent.emit(empleado.idPersona)
  }

  getFullName(empleado: Empleado): string {
    return empleado.apellido + ' ' + empleado.nombre;
  }

  diasDisponibles(idEmpleado: number): number {
    let dias: number = 0;
    console.log('DIS:::', this.vacacionSvc.getDiasDisponibles(idEmpleado));
    return dias;
  }

  calcAntiguedad(fecha: string): number {
    return this.dateAuxSvc.calcAntiguedad(fecha);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
