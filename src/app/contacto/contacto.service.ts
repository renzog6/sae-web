import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private baseUrl = 'http://localhost:8080/api/contacto/list';

  constructor(private http: HttpClient) { }

  getContactoList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getContacto(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

}
