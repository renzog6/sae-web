import { Observable } from 'rxjs';
import { EmpleadoCategoria } from './empleado-categoria.model';
import { EmpleadoPuesto } from './empleado-puesto.model';

export class Empleado {

  id?: number;
  nombre: string | undefined;
  apellido: string | undefined;
  nacimiento!: Date;
  dni: string | undefined;
  cuil: string | undefined;
  domicilio: string | undefined;
  contacto: string | undefined;
  categoria: string | undefined;
  puesto: EmpleadoPuesto | undefined;
  genero: any;
  estado: any;
  estadoCivil: any;
  info: any;
  fechaAlta: any;
  fechaBaja: any;

/*   constructor(json?: any) {
    this.id = json.idPersona;
    this.nombre = json.nombre;
    this.apellido = json.apellido;
    this.nacimiento = new Date(json.nacimiento);
    this.dni = json.dni;
    this.cuil = json.cuil;
    this.puesto = json.puesto;
    this.domicilio = "";
    this.contacto ="";
    this.categoria="";
  } */

  getFullName(): string {
    return this.apellido + ' ' + this.nombre;
  }

  getEdad(): number{
    const hoy = new Date();
    let edad = hoy.getFullYear() - this.nacimiento.getFullYear();
    const m = hoy.getMonth() - this.nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < this.nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
