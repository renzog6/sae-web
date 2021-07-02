import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from './model/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private baseUrl = 'http://localhost:8080/api/empleado';

  constructor(private http: HttpClient) { }

  getList(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/list`);
  }

  /* find(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  } */

 find(id): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/${id}`);
  }

}
