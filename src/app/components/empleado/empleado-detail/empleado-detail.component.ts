import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';

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
  model: NgbDateStruct = { year: 1789, month: 7, day: 14 }

  dto={
    idPersona:3,
    nombre:"Lalo",
    apellido:"Lamda"
  }

  constructor(
    private service:EmpleadoService,
    ) {}

  ngOnInit(): void {
    this.empleado.setDatos(this.dto);

    this.service.emitter.subscribe(
      data=>{
        this.empleado.setDatos(data);
        console.log(this.empleado)
      }
    )

  }

}
function NgbdDatepicker(NgbdDatepicker: any) {
  throw new Error('Function not implemented.');
}

