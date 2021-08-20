import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { Vacacion } from 'src/app/models/vacacion.models';
import { VacacionService } from 'src/app/services/vacacion.services';

@Component({
  selector: 'app-vacacion-list',
  templateUrl: './vacacion-list.component.html',
  styleUrls: ['./vacacion-list.component.scss']
})
export class VacacionListComponent implements OnInit {

  @Input() idEmpleado!: number;
  ngOnChanges(changes: SimpleChanges) {

    console.log(changes);
    this.loadVacaciones(changes.idEmpleado.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['fecha', 'detalle', 'dias', 'anio', 'fechaToma', 'info', 'accion'];
  dataSource = new MatTableDataSource<Vacacion>();

  constructor(
    private vacacionSvc: VacacionService,
  ) { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadVacaciones(id: number): void {
    if (id != -1) {
      this.vacacionSvc.getListVacacion(id).pipe(
        tap((res: Vacacion[]) => (this.dataSource.data = res))
      ).subscribe();
    } else {
      this.dataSource.data = [];
    }
  }

  printVacacion(vaca: Vacacion): void {

  }

}
