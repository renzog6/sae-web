import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html',
  styleUrls: ['./empleado-list.component.scss']
})
export class EmpleadoListComponent implements OnInit {

  columnas: string[] = ['apellido', 'dni', 'fechaAlta', 'antiguedad', 'puesto', 'categoria', 'details'];
  dataSource = new MatTableDataSource<Empleado>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empleadoSvc: EmpleadoService
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

  redirectToDetails(id: number): void {

  }

  getFullName(empleado: Empleado): string {
    return empleado.apellido + ' ' + empleado.nombre;
  }


  calcAntiguedad(ff: string): number {
    let fecha = new Date(ff);
    let edad: number = 0;
    try {
      const hoy = new Date();
      edad = hoy.getFullYear() - fecha.getFullYear();
      const m = hoy.getMonth() - fecha.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }
    } catch (error) {
      console.error("Log error", error);
    }
    return edad;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
