import { Injectable,Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleado } from '../models/empleado.model';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  empleado: Empleado = new Empleado();
  @Output()
  emitter = new EventEmitter<Empleado>();

  setActive(current:Empleado):void{
    this.empleado = current;
    this.cambiar();
  }

  cambiar():void{
    this.emitter.emit(this.empleado);
  }

  private apiUrl = environment.baseUrl+'/api/empleado/list';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }
  getList(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
