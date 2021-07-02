import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private baseUrl = 'http://localhost:8080/api/empresa/list';

  constructor(private http: HttpClient) { }

  getList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

}
