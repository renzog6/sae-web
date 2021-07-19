"use strict";
import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';


@Component({
  selector: 'app-empleado-detail',
  templateUrl: './empleado-detail.component.html',
  styleUrls: ['./empleado-detail.component.css']
})
export class EmpleadoDetailComponent implements OnInit {

  empleado: Empleado = new Empleado();
  edad: Number=0;
  dateNa!: NgbDateStruct;
  dateAlta!: NgbDateStruct;

  constructor(
    private service:EmpleadoService
    ) {}

  ngOnInit(): void {
    //this.empleado.setDatos(this.dto);

    this.service.emitter.subscribe(
      data=>{
        this.empleado.setDatos(data);
        //this.empleado=data;
        this.dateNa = { day: this.empleado.nacimiento.getUTCDate(), month: this.empleado.nacimiento.getUTCMonth() + 1, year: this.empleado.nacimiento.getUTCFullYear()};
        this.dateAlta = { day: this.empleado.fechaAlta.getUTCDate(), month: this.empleado.fechaAlta.getUTCMonth() + 1, year: this.empleado.fechaAlta.getUTCFullYear()};
        console.log(data)
      }
    )

  }

}


