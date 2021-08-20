import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Empleado } from 'src/app/models/empleado.model';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-empleado-details',
  templateUrl: './empleado-details.component.html',
  styleUrls: ['./empleado-details.component.scss']
})
export class EmpleadoDetailsComponent implements OnInit {

  empleadoSelect!: Empleado;

  constructor(
    private empleadoSvc: EmpleadoService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(): void {
    let id: string = this.activeRoute.snapshot.params['id'];
    this.empleadoSvc.get(id).pipe(
      tap((res: Empleado) => (this.empleadoSelect = res))
    ).subscribe();
  }

}
