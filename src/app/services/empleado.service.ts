import { Injectable,Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
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
   // return this.http.get<Empleado[]>(this.apiUrl);
    return this.http.get<Empleado[]>(this.apiUrl).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  getList(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  handleError(error:any) {

    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
