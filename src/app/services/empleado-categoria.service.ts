import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmpleadoCategoria } from '../models/empleado-categoria.model';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoCategoriaService {

  private apiUrl = environment.baseUrl + '/api/empleado-categoria';

  constructor(private http: HttpClient) { }

  getAll(): Observable<EmpleadoCategoria[]> {
    return this.http.get<EmpleadoCategoria[]>(this.apiUrl + '/list').pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  get(id: any): Observable<EmpleadoCategoria> {
    return this.http.get<EmpleadoCategoria>(`${this.apiUrl}/${id}`);
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

  handleError(error: any) {

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
