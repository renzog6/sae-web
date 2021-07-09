import { Component, OnInit } from '@angular/core';
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

  constructor(private service:EmpleadoService) { }

  ngOnInit(): void {
    this.service.emitter.subscribe(
      data=>{this.empleado=data;
      //this.edad = this.empleado.getEdad();
      }
    );

  }

}
