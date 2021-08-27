import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { interval, Observable, throwError } from "rxjs";
import { retry, catchError, tap, map, first, filter } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IDiasDisponibles, Vacacion } from "../models/vacacion.models";


@Injectable({
  providedIn: "root",
})
export class VacacionService {
  private apiUrl = environment.baseUrl + "/api/empleado/vacacion";

  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  httpOptions = {
    headers: this.headers,
  };

  constructor(private httpClient: HttpClient) { }

  getListByEmpleado(idEmpleado: any): Observable<Vacacion[]> {
    let API_URL = `${this.apiUrl}/${idEmpleado}/list`;
    return this.httpClient
      .get<Vacacion[]>(API_URL, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }


  getDiasDisponibles(): Observable<IDiasDisponibles[]> {
    let API_URL = `${this.apiUrl}/diasDisponibles`;
    return this.httpClient
      .get<IDiasDisponibles[]>(API_URL, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  create(idEmpleado: number, data: Vacacion): Observable<any> {
    let API_URL = `${this.apiUrl}/${idEmpleado}/create`;
    return this.httpClient.post(API_URL, this.dataTo(data), this.httpOptions);
  }

  dataTo(data: Vacacion): Vacacion {
    let vaca = new Vacacion();
    vaca.idVacacion = -1;
    vaca.fecha = data.fecha;
    vaca.detalle = data.detalle;
    vaca.dias = data.dias;
    vaca.anio = data.anio;
    vaca.fechaToma = data.fechaToma;
    vaca.info = data.info;
    let d = new Date;
    d.getTimezoneOffset
    vaca.fechaLiquida = new Date;
    vaca.created = new Date;
    vaca.updated = new Date;

    return vaca;
  }

  get(id: any): Observable<Vacacion> {
    let API_URL = `${this.apiUrl}/${id}`;
    return this.httpClient
      .get<Vacacion>(API_URL, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  delete(id: any): Observable<Vacacion> {
    let API_URL = `${this.apiUrl}/delete/${id}`;
    return this.httpClient
      .delete<Vacacion>(API_URL, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /*
    download(idEmpleado: any): Observable<Blob> {
      let API_URL = `${this.apiUrl}/download/${idEmpleado}`;
      return this.httpClient.get(API_URL, {
        responseType: 'blob'
      });
    } */

  download(idEmpleado: any): Observable<HttpEvent<Blob>> {
    let API_URL = `${this.apiUrl}/download/${idEmpleado}`;
    return this.httpClient.get(API_URL, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
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

