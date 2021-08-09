import { Contacto } from "./contacto.model";
import { Direccion } from "./direccion.model";
import { EmpleadoCategoria } from "./empleado-categoria.model";
import { EmpleadoPuesto } from "./empleado-puesto.model";
import { Estado, EstadoCivil } from "./estado-civil.enum";
import { Genero } from "./genero.enum";

export interface IEmpleado {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  dni: string;
  gender: Genero;
  address: Direccion;
  maritalStatus: EstadoCivil;
  dateStart: Date;
  cuil: string;
  category: EmpleadoCategoria;
  position: EmpleadoPuesto;
  info: string;
};

export class Empleado {
  idPersona!: number;
  nombre!: string;
  apellido!: String;
  nacimiento!: Date;
  dni!: String;
  cuil!: String;
  domicilio!: Direccion;
  contacto!: Contacto;
  categoria!: EmpleadoCategoria;
  puesto!: EmpleadoPuesto;
  genero!: Genero;
  estado!: Estado;
  estadoCivil!: EstadoCivil;
  info!: String;
  fechaAlta!: Date;
  fechaBaja!: Date;

  constructor() { }

  /*   setDatos(dto: any): void {
    try {
      this.idPersona = dto.idPersona;
      this.nombre = dto.nombre;
      this.apellido = dto.apellido;
      this.dni = dto.dni;
      this.cuil = dto.cuil;
      this.nacimiento = new Date(dto.nacimiento);
      this.domicilio = dto.domicilio;
      this.genero = dto.genero;
      this.estadoCivil = dto.estadoCivil;
      this.categoria = dto.categoria;
      this.puesto = dto.puesto;
      this.fechaAlta = new Date(dto.fechaAlta);
      this.fechaBaja = new Date(dto.fechaBaja);

    } catch (error) {
      console.error("Log error", error);
    }
  }

  getAntiguedad(): number {
    let edad: number = 0;
    try {
      const hoy = new Date();
      edad = hoy.getFullYear() - this.fechaAlta.getFullYear();
      const m = hoy.getMonth() - this.fechaAlta.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < this.fechaAlta.getDate())) {
        edad--;
      }
    } catch (error) {
      console.error("Log error", error);
    }
    return edad;
  } */
};
