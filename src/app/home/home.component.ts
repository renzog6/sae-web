import { Component, OnInit } from '@angular/core';
import { Empleado } from '../models/empleado.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  empleado: Empleado = new Empleado();

  constructor() { }

  ngOnInit(): void {
  }

}
