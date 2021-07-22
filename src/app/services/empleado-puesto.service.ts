import { Injectable,Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmpleadoPuesto } from '../models/empleado-puesto.model';



@Injectable({
  providedIn: 'root'
})
export class EmpleadoPuestoService {

  private apiUrl = environment.baseUrl+'/api/empleado-puesto';

  constructor(private http: HttpClient) { }

  getAll(): Observable<EmpleadoPuesto[]> {
    return this.http.get<EmpleadoPuesto[]>(this.apiUrl+'/list').pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  get(id: any): Observable<EmpleadoPuesto> {
    return this.http.get<EmpleadoPuesto>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
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
