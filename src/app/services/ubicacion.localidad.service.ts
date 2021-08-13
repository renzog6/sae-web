import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { retry, catchError, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Localidad } from "../models/ubicacion.localidad.model";

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
