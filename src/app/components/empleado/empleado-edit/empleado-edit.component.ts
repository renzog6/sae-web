import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Empleado } from 'src/app/models/empleado.model';
import { Genero } from 'src/app/models/genero.enum';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado-edit',
  templateUrl: './empleado-edit.component.html',
  styleUrls: ['./empleado-edit.component.css']
})
export class EmpleadoEditComponent implements OnInit {

  empleado: Empleado = new Empleado();
  edad: Number=0;
  dateNa!: NgbDateStruct;
  dateAlta!: NgbDateStruct;

  generos = Object.values(Genero);

  constructor(
    private service:EmpleadoService,
    route: ActivatedRoute
    ) {
      route.params.subscribe(params => console.log("ID Empleado: ",params['id']));
    }

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

  onGeneroChanged(value:Genero) {
    console.log('Genero:::')
    console.log(value)
  }
}
