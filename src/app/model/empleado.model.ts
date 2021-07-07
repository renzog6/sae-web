import { Observable } from 'rxjs';
import { Contacto } from '../../contacto/contacto';
import { EmpleadoCategoria } from './empleado-categoria.model';
import { EmpleadoPuesto } from './empleado-puesto.model';

export class Empleado {

  id: number;
  nombre: string;
  apellido: string;
  nacimiento: Date;
  dni: string;
  cuil: string;
  domicilio: string;
  contacto: string;
  categoria: string;
  puesto: EmpleadoPuesto;
  genero: any;
  estado: any;
  estadoCivil: any;
  info: any;
  fechaAlta: any;
  fechaBaja: any;

  constructor(json?: any) {
    this.id = json.idPersona;
    this.nombre = json.nombre;
    this.apellido = json.apellido;
    this.nacimiento = new Date(json.nacimiento);
    this.dni = json.dni;
    this.cuil = json.cuil;
    this.puesto = json.puesto;
  }

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
