import { Injectable,Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empleado } from '../models/empleado.model';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private apiUrl = environment.baseUrl+'/api/empresa/list';

  constructor(private http: HttpClient) { }

  getList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
