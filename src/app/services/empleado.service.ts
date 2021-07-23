import { Injectable, Output, EventEmitter } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { retry, catchError, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Empleado } from "../models/empleado.model";

@Injectable({
  providedIn: "root",
})
export class EmpleadoService {

  empleado: Empleado = new Empleado();
  @Output()
  emitter = new EventEmitter<Empleado>();

  setActive(current: Empleado): void {
    this.empleado = current;
    this.cambiar();
  }

  cambiar(): void {
    this.emitter.emit(this.empleado);
  }

  private apiUrl = environment.baseUrl + "/api/empleado";

  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  httpOptions = {
    headers: this.headers,
  };

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Empleado[]> {
    return this.httpClient
      .get<Empleado[]>(this.apiUrl + "/list", this.httpOptions)
      .pipe(
/*         tap((data) => {
          return data.map((item) => {
            const empleado: Empleado = {
              idPersona: item.idPersona,
              nombre: item.nombre,
              apellido: item.apellido,
              nacimiento: item.nacimiento,
              dni: item.dni,
              cuil: item.cuil,
              domicilio: item.domicilio,
              contacto: item.contacto,
              categoria: item.categoria,
              puesto: item.puesto,
              genero: item.genero,
              estado: item.estado,
              estadoCivil: item.estadoCivil,
              info: item.info,
              fechaAlta: item.fechaAlta,
              fechaBaja: item.fechaBaja,
              //setDatos:item.setDatos,
              //getEdad:item.getEdad,
              //getAntiguedad:Number
            };
            return empleado;
          });
        }), */
        retry(1),
        catchError(this.handleError)
      );
  }

 /* get(id: any): Observable<Empleado> {
    return this.httpClient.get<Empleado>(`${this.apiUrl}/${id}`,this.httpClientOptions);
  }*/

  // Get single object
  get(id:any): Observable<Empleado> {
    let API_URL = `${this.apiUrl}/${id}`;
    return this.httpClient.get(API_URL, this.httpOptions)
      .pipe(map((res: any) => {
          return res || {}
        }),
        catchError(this.handleError)
      )
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(this.apiUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
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
