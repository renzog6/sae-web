"use strict";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


import { Empleado } from 'src/app/models/empleado.model';
import { EstadoCivil } from 'src/app/models/estado-civil.enum';
import { Genero } from 'src/app/models/genero.enum';
import { EmpleadoService } from 'src/app/services/empleado.service';


@Component({
  selector: 'app-empleado-detail',
  templateUrl: './empleado-detail.component.html',
  styleUrls: ['./empleado-detail.component.css']
})
export class EmpleadoDetailComponent implements OnInit {

  empleado: Empleado = new Empleado();
  dateNacimiento!: NgbDateStruct;
  dateAlta!: NgbDateStruct;

  generos = Object.values(Genero);
  estadoCivils = Object.values(EstadoCivil);

  message = '';

  constructor(
    private service:EmpleadoService,
    private route: ActivatedRoute,
    private router: Router
    ) {
      route.params.subscribe(params => console.log("ID Empleado: ",params['id']));
    }

  ngOnInit(): void {
    this.getEmpleado(this.route.snapshot.params.id);

/*     this.service.emitter.subscribe(
      data=>{
        this.empleado.setDatos(data);
        //this.empleado=data;
        this.dateNacimiento = { day: this.empleado.nacimiento.getUTCDate(), month: this.empleado.nacimiento.getUTCMonth() + 1, year: this.empleado.nacimiento.getUTCFullYear()};
        this.dateAlta = { day: this.empleado.fechaAlta.getUTCDate(), month: this.empleado.fechaAlta.getUTCMonth() + 1, year: this.empleado.fechaAlta.getUTCFullYear()};
        console.log(data)
      }
    ) */

  }

  getEmpleado(id: string): void {
    this.service.get(id)
      .subscribe(
        data => {
          //this.empleado = data;
          this.empleado.setDatos(data);
          this.dateNacimiento = { day: this.empleado.nacimiento.getUTCDate(), month: this.empleado.nacimiento.getUTCMonth() + 1, year: this.empleado.nacimiento.getUTCFullYear()};
          this.dateAlta = { day: this.empleado.fechaAlta.getUTCDate(), month: this.empleado.fechaAlta.getUTCMonth() + 1, year: this.empleado.fechaAlta.getUTCFullYear()};
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  update(): void {
    this.message = '';

    this.empleado.nacimiento = this.updateDate(this.dateNacimiento);
    this.empleado.fechaAlta = this.updateDate(this.dateAlta)

    this.service.update(this.empleado.idPersona, this.empleado)
      .subscribe(
        response => {
          console.log("UPDATE SUBCRIBE::: ");
          console.log(response);
          this.message = response.message ? response.message : 'This tutorial was updated successfully!';
        },
        error => {
          console.log("UPDATE ERROR::: " + error.message);
          this.message = error.message;
          //this.router.navigate(['/empleado/list'])
        });
  }

  updateDate(newdate:NgbDateStruct):any{
    return new Date(newdate.year, newdate.month-1, newdate.day);
  }

  delete(): void {
    this.service.delete(this.empleado.idPersona)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/list']);
        },
        error => {
          console.log(error);
        });
  }

  onGeneroChanged(value:Genero) {
    console.log("change:::"+value)
   // this.empleado.genero= value;
  }

  updateHistorial(status: boolean): void {
/*     const data = {
      title: this.empleado.title,
      description: this.empleado.description,
      published: status
    };

    this.message = '';

    this.service.update(this.empleado.idPersona, data)
      .subscribe(
        response => {
          this.empleado.published = status;
          console.log(response);
          this.message = response.message ? response.message : 'The status was updated successfully!';
        },
        error => {
          console.log(error);
        }); */
  }

}


