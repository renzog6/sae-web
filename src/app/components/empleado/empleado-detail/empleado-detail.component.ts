import { Component, OnInit } from '@angular/core';

import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado-detail',
  templateUrl: './empleado-detail.component.html',
  styleUrls: ['./empleado-detail.component.css']
})
export class EmpleadoDetailComponent implements OnInit {

  empleado!: Empleado;// = new Empleado();
  edad: Number=0;

  constructor(
    private service:EmpleadoService,
    ) {}

  ngOnInit(): void {
    this.service.emitter.subscribe(
      data=>{ this.empleado=data;
      console.log(this.service.empleado.domicilio)
      }
    );

  }

  getEdad = function(e:Empleado) {
    console.log("Hello!");
    const hoy = new Date();
    let edad = hoy.getFullYear() - e.nacimiento.getFullYear();
    const m = hoy.getMonth() - e.nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < e.nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

}
