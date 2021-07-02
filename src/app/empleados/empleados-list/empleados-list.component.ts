import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Empleado } from '../model/empleado.model';
import { EmpleadoService } from '../empleado.service';


@Component({
  selector: 'app-empleados-list',
  templateUrl: './empleados-list.component.html',
  styleUrls: ['./empleados-list.component.css']
})
export class EmpleadosListComponent implements OnInit, OnDestroy {

  empleados = new Array<Empleado>();//Observable<Empleado[]>;
  selectedEmpleado: any;

  filtro: '0';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private empleadoService: EmpleadoService, private router: Router
  ) {}

  ngOnInit(): void {
    this.reloadData();
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json' }
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  reloadData() {
/*    this.empleadoService.getList().subscribe((data: Empleado[]) => {
      this.empleados = data;
      this.dtTrigger.next();
    });
*/
    this.empleadoService.getList().subscribe(response => {
        this.empleados = response.map(item => {
          return new Empleado(item);
        });
        this.dtTrigger.next();
      });
  }

  public selectEmpleado(e: any) {
    this.selectedEmpleado = e;
    console.log(e.nombre);
  }

  public cambioFiltro(){
    console.log(this.filtro);
  }

}
