import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDireccion } from "../models/ubicacion.direccion.model";
import { Contacto } from "../models/contacto.model";

@Injectable({
  providedIn: "root",
})
export class ContactoService {

  private apiUrl = environment.baseUrl + "/api/contacto";

  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  httpOptions = {
    headers: this.headers,
  };

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<Contacto[]> {
    return this.httpClient
      .get<Contacto[]>(this.apiUrl + "/list", this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  update(id: any, data: Contacto): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/update/${id}`, data, this.httpOptions);
  }

  handleError(error: any) {
    let errorMessage = "";
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
