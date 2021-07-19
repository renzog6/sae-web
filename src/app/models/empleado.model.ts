import { EmpleadoPuesto } from "./empleado-puesto.model";
import { estadoCivil } from "./estado-civil.enum";
import { genero } from "./genero.enum";

export class Empleado {
  idPersona: number = 0;
  nombre: string = "";
  apellido: string = "";
  nacimiento!: Date;// = new Date();
  dni: string = "";
  cuil: string  = "";
  domicilio: string | undefined;
  contacto: string | undefined;
  categoria: string | undefined;
  puesto: EmpleadoPuesto | undefined;
  genero!: genero;
  estado: any;
  estadoCivil!: estadoCivil;
  info: any;
  fechaAlta!: Date;
  fechaBaja!: Date;

  constructor() {}

  setDatos(dto: any): void {
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
      this.fechaAlta = new Date(dto.fechaAlta);
      this.fechaBaja = new Date(dto.fechaBaja);

    } catch (error) {
      console.error("Log error", error);
    }
  }

  getEdad(): number {
    let edad: number = 0;
    try {
      const hoy = new Date();
      edad = hoy.getFullYear() - this.nacimiento.getFullYear();
      const m = hoy.getMonth() - this.nacimiento.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < this.nacimiento.getDate())) {
        edad--;
      }
    } catch (error) {
      console.error("Log error", error);
    }
    return edad;
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
  }
}
