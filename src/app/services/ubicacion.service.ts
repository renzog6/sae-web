import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { retry, catchError, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Localidad } from "../models/ubicacion.localidad.model";
import { Direccion, IDireccion } from "../models/ubicacion.direccion.model";

@Injectable({
  providedIn: "root",
})
export class LocalidadService {

  private apiUrl = environment.baseUrl + "/api/ubicacion";

  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  httpOptions = {
    headers: this.headers,
  };

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<Localidad[]> {
    return this.httpClient
      .get<Localidad[]>(this.apiUrl + "/localidad/list", this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  get(id: any): Observable<Localidad> {
    return this.httpClient
      .get<Localidad>(`${this.apiUrl}/localidad/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
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

@Injectable({
  providedIn: "root",
})
export class DireccionService {

  private apiUrl = environment.baseUrl + "/api/ubicacion";

  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  httpOptions = {
    headers: this.headers,
  };

  constructor(private httpClient: HttpClient) { }

  getList(): Observable<IDireccion[]> {
    return this.httpClient
      .get<IDireccion[]>(this.apiUrl + "/direccion/list", this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  update(id: any, data: Direccion): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/direccion/update/${id}`, data, this.httpOptions);
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

