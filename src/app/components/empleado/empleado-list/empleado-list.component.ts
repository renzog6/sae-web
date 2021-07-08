import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html',
  styleUrls: ['./empleado-list.component.css']
})
export class EmpleadoListComponent implements OnInit {

  empleados: Empleado[] = [];
  current: Empleado = new Empleado();
  currentIndex = -1;
  title = '';

  filter = new FormControl('');

  constructor(
    private service:EmpleadoService
  ) { }

  ngOnInit(): void {
    this.retrieve();
  }

  retrieve(): void {
    this.service.getAll()
      .subscribe(
        data => {
          this.empleados = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieve();
    this.current = new Empleado();
    this.currentIndex = -1;
  }

  setActive(empleado: Empleado, index: number): void {
    this.current = empleado;
    this.service.setActive(this.current);
    this.currentIndex = index;
  }

  removeAll(): void {
/*     this.service.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        }); */
  }

  search(): void {
/*     this.current = {};
    this.currentIndex = -1;

    this.service.findByTitle(this.title)
      .subscribe(
        data => {
          this.tutorials = data;
          console.log(data);
        },
        error => {
          console.log(error);
        }); */
  }

}
