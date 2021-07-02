import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Empleado } from '../model/empleado.model';
import { EmpleadoService } from '../empleado.service';

@Component({
  selector: 'app-empleados-detail',
  templateUrl: './empleados-detail.component.html',
  styleUrls: ['./empleados-detail.component.css']
})
export class EmpleadosDetailComponent implements OnInit, OnDestroy {

  @Input() empleado: Empleado;
  
  model;
  
  format = 'dd/MM/yyyy';

  constructor(
    private activeRoute: ActivatedRoute,
    private empleadoService: EmpleadoService
  ) {
    //this.id = this.activeRoute.snapshot.params.id;
    // console.log(this.id);
  }

  ngOnInit(): void {
    this.loadData(this.activeRoute.snapshot.params.id);
  }

  ngOnDestroy(): void {
  }

  /*   loadData(id) {
      this.empleadoService.find(id).subscribe(data => {
        this.empleado = data;
      });
    } */

  /*loadData(id) {
    this.empleadoService.find(id)
    .subscribe(
      (data: Empleado) => {
        this.empleado = data;
        console.log(data);
      },
      error => {
        console.log(error);
      });
  }
  */
  loadData(id) {
    this.empleadoService.find(id).subscribe(e => {
      this.empleado = new Empleado(e);
      //this.model = this.empleado.nacimiento.toISOString();
      //this.model = { "year": this.empleado.nacimiento.getUTCFullYear(), "month": 2, "day": 12 };
      this.model = this.empleado.nacimiento
      console.log(this.model = this.empleado.nacimiento);

      console.log(e);
    },
      error => {
        console.log(error);
      });

  }

  updateMyDate(newDate) {
    console.log(newDate);
  }

}