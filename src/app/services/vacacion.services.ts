import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval, Observable, throwError } from "rxjs";
import { retry, catchError, tap, map, first } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Vacacion } from "../models/vacacion.models";


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

  getListVacacion(idEmpleado: any): Observable<Vacacion[]> {
    let API_URL = `${this.apiUrl}/${idEmpleado}`;
    return this.httpClient
      .get<Vacacion[]>(API_URL, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /*   getDiasDisponibles(idEmpleado: any): Observable<number> {
      let API_URL = `${this.apiUrl}/${idEmpleado}/dias`;
      return this.httpClient
        .get<number>(API_URL, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    } */

  getDiasDisponibles(idEmpleado: number): number {
    let API_URL = `${this.apiUrl}/${idEmpleado}/dias`;
    let dias: number = 0;
    this.httpClient
      .get<number>(API_URL, this.httpOptions)
      .pipe(
        tap(res => console.log('XXXXXXXXX:::', res)),
        retry(1),
        catchError(this.handleError)
      );

    console.log('OBS::::::::', dias)
    return dias;
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
function value(value: any): (value: number) => void {
  throw new Error("Function not implemented.");
}

