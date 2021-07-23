"use strict";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { EmpleadoCategoria } from "src/app/models/empleado-categoria.model";
import { EmpleadoPuesto } from "src/app/models/empleado-puesto.model";

import { Empleado } from "src/app/models/empleado.model";
import { EstadoCivil } from "src/app/models/estado-civil.enum";
import { Genero } from "src/app/models/genero.enum";
import { EmpleadoCategoriaService } from "src/app/services/empleado-categoria.service";
import { EmpleadoPuestoService } from "src/app/services/empleado-puesto.service";
import { EmpleadoService } from "src/app/services/empleado.service";

@Component({
  selector: "app-empleado-detail",
  templateUrl: "./empleado-detail.component.html",
  styleUrls: ["./empleado-detail.component.css"],
})
export class EmpleadoDetailComponent implements OnInit {
  empleado: Empleado = new Empleado();
  dateNacimiento!: NgbDateStruct;
  dateAlta!: NgbDateStruct;

  generos = Object.values(Genero);
  estadoCivils = Object.values(EstadoCivil);

  categorias!:EmpleadoCategoria[];
  puetos!:EmpleadoPuesto[];


  message = "";

  constructor(
    private empleadoService: EmpleadoService,
    private puestoService: EmpleadoPuestoService,
    private categoriaService: EmpleadoCategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    route.params.subscribe((params) =>
    this.getEmpleado(params["id"])
    );
  }

  ngOnInit(): void {
    //this.getEmpleado(this.route.snapshot.params.id);

    this.puestoService.getAll().subscribe(
      data => {
        this.puetos = data;
        console.log(data);
      },
      error => {
        console.log(error);
      });

      this.categoriaService.getAll().subscribe(
        data => {
          this.categorias = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  getEmpleado(id: string): void {
    this.empleadoService.get(id).subscribe(
      (data) => {
      this.setDatos(data);
      this.dateNacimiento = {
        day: this.empleado.nacimiento.getUTCDate(),
        month: this.empleado.nacimiento.getUTCMonth() + 1,
        year: this.empleado.nacimiento.getUTCFullYear(),
      };
      this.dateAlta = {
        day: this.empleado.fechaAlta.getUTCDate(),
        month: this.empleado.fechaAlta.getUTCMonth() + 1,
        year: this.empleado.fechaAlta.getUTCFullYear(),
      };
        console.log(this.empleado);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setDatos(dto: any): void {
    try {
      this.empleado.idPersona = dto.idPersona;
      this.empleado.nombre = dto.nombre;
      this.empleado.apellido = dto.apellido;
      this.empleado.dni = dto.dni;
      this.empleado.cuil = dto.cuil;
      this.empleado.nacimiento = new Date(dto.nacimiento);
      this.empleado.domicilio = dto.domicilio;
      this.empleado.genero = dto.genero;
      this.empleado.estadoCivil = dto.estadoCivil;
      this.empleado.categoria = dto.categoria;
      this.empleado.puesto = dto.puesto;
      this.empleado.fechaAlta = new Date(dto.fechaAlta);
      this.empleado.fechaBaja = new Date(dto.fechaBaja);

    } catch (error) {
      console.error("Log error", error);
    }
  }

  update(): void {
    this.message = "";

    this.empleado.nacimiento = this.updateDate(this.dateNacimiento);
    this.empleado.fechaAlta = this.updateDate(this.dateAlta);

    this.empleadoService.update(this.empleado.idPersona, this.empleado).subscribe(
      (response) => {
        console.log("UPDATE SUBCRIBE::: ");
        console.log(response);
        this.message = response.message
          ? response.message
          : "This tutorial was updated successfully!";
      },
      (error) => {
        console.log("UPDATE ERROR::: " + error.message);
        this.message = error.message;
        //this.router.navigate(['/empleado/list'])
      }
    );
  }

  updateDate(newdate: NgbDateStruct): any {
    return new Date(newdate.year, newdate.month - 1, newdate.day);
  }

  delete(): void {
    this.empleadoService.delete(this.empleado.idPersona).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(["/list"]);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGeneroChanged(value: Genero) {
    console.log("change:::" + value);
    // this.empleado.genero= value;
  }

  updateHistorial(status: boolean): void {
    /*     const data = {
      title: this.empleado.title,
      description: this.empleado.description,
      published: status
    };

    this.message = '';

    this.empleadoService.update(this.empleado.idPersona, data)
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
