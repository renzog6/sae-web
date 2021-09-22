import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Empleado } from 'src/app/models/empleado.model';
import { DateAuxService } from 'src/app/services/date-aux.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { VacacionService } from 'src/app/services/vacacion.services';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html',
  styleUrls: ['./empleado-list.component.scss']
})
export class EmpleadoListComponent implements OnInit {

  isLoading: boolean = true;

  columnas: string[] = ['apellido', 'dni', 'fechaAlta', 'antiguedad', 'puesto', 'categoria', 'details'];
  dataSource = new MatTableDataSource<Empleado>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empleadoSvc: EmpleadoService,
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
    this.empleadoSvc.getList().subscribe(
      (res: Empleado[]) => {
        this.dataSource.data = res,
          this.isLoading = false
      },
      error => this.isLoading = false
    );
  }

  redirectToDetails(id: number): void {
    let url: string = `empleados/details/${id}`;
    this.router.navigate([url]);
  }

  getFullName(empleado: Empleado): string {
    return empleado.apellido + ' ' + empleado.nombre;
  }

  calcAntiguedad(fecha: string): number {
    return this.dateAuxSvc.calcAntiguedad(fecha);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
