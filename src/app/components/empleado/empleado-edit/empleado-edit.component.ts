import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmpleadoCategoria } from 'src/app/models/empleado-categoria.model';
import { EmpleadoPuesto } from 'src/app/models/empleado-puesto.model';
import { Empleado } from 'src/app/models/empleado.model';
import { EstadoCivil } from 'src/app/models/estado-civil.enum';
import { Genero } from 'src/app/models/genero.enum';
import { EmpleadoCategoriaService } from 'src/app/services/empleado-categoria.service';
import { EmpleadoPuestoService } from 'src/app/services/empleado-puesto.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado-edit',
  templateUrl: './empleado-edit.component.html',
  styleUrls: ['./empleado-edit.component.css']
})
export class EmpleadoEditComponent implements OnInit {

  empleado: Empleado = new Empleado();
  dateNacimiento!: NgbDateStruct;
  dateAlta!: NgbDateStruct;

  generos = Object.values(Genero);
  estadoCivils = Object.values(EstadoCivil);

  categorias!: EmpleadoCategoria[];
  puetos!: EmpleadoPuesto[];

  constructor(
    private empleadoService: EmpleadoService,
    private puestoService: EmpleadoPuestoService,
    private categoriaService: EmpleadoCategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPuestos();
    this.loadCategorias();
    this.empleado.puesto = new EmpleadoPuesto();
    this.empleado.categoria = new EmpleadoCategoria();
  }

  private loadCategorias(): void {
    this.categoriaService.getAll()
      .pipe(

        tap((res) => { this.categorias = res }),

      ).subscribe();
  }

  private loadPuestos(): void {
    this.puestoService.getAll().subscribe(
      (data) => {
        this.puetos = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGeneroChanged(value: Genero) {
    console.log('Genero:::')
    console.log(value)
  }
}
