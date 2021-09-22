import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { retry, catchError, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Empleado, IEmpleado } from "../models/empleado.model";
import { Estado } from "../models/estado-civil.enum";
import { Contacto } from "../models/contacto.model";

@Injectable({
  providedIn: "root",
})
export class EmpleadoService {

  private apiUrl = environment.baseUrl + "/api/empleado";

  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  private httpOptions = {
    headers: this.headers,
  };

  constructor(
    private httpClient: HttpClient,
  ) { }

  getList(): Observable<Empleado[]> {
    return this.httpClient
      .get<Empleado[]>(this.apiUrl + "/list", this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  get(id: any): Observable<Empleado> {
    let API_URL = `${this.apiUrl}/${id}`;
    return this.httpClient.get(API_URL, this.httpOptions)
      .pipe(map((res: any) => {
        return res || {}
      }),
        catchError(this.handleError)
      )
  }

  create(data: IEmpleado): Observable<any> {
    return this.httpClient.post(this.apiUrl + "/create", this.dataToEmpleado(data), this.httpOptions);
  }

  dataToEmpleado(data: IEmpleado): Empleado {
    let contactos: Contacto[] = [];

    let cox: Contacto = new Contacto;
    cox.nombre = 'Personal';
    cox.tipo = 'CELULAR'
    if (data.cellPhone != undefined) {
      cox.dato = data.cellPhone
      cox.info = '';
    } else {
      cox.dato = '0'
      cox.info = '';
    }
    contactos.push(cox);

    cox = new Contacto;
    cox.nombre = 'Personal';
    cox.tipo = 'EMAIL';
    if (data.email != undefined) {
      cox.dato = data.email
      cox.info = '';
    } else {
      cox.dato = 'sin-mail@mail.com';
      cox.info = '';
    }
    contactos.push(cox);

    let emp = new Empleado();
    emp.idPersona = -1;
    emp.nombre = data.firstName;
    emp.apellido = data.lastName;
    emp.nacimiento = data.dateOfBirth;
    emp.dni = data.dni;
    emp.cuil = data.cuil;
    emp.domicilio = data.address;
    emp.contactoList = contactos;
    emp.categoria = data.category;
    emp.puesto = data.position;
    emp.genero = data.gender;
    emp.estado = Estado.ACTIVO;
    emp.estadoCivil = data.maritalStatus;
    emp.info = data.info;
    emp.fechaAlta = data.dateStart;
    emp.fechaBaja = new Date;

    return emp;
  }

  update(id: any, data: IEmpleado): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/update/${id}`, this.dataToEmpleado(data), this.httpOptions);
  }

  darBaja(data: Empleado): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/darBaja`, data, this.httpOptions);
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
