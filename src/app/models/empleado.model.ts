import { Direccion } from "./direccion.model";
import { EmpleadoCategoria } from "./empleado-categoria.model";
import { EmpleadoPuesto } from "./empleado-puesto.model";
import { EstadoCivil } from "./estado-civil.enum";
import { Genero } from "./genero.enum";

export class Empleado {

  idPersona!: Number;// = 0;
  nombre!: String;// = "";
  apellido!: String;// = "";
  nacimiento!: Date;// = new Date();
  dni!: String; //= "";
  cuil!: String;//  = "";
  domicilio!: Direccion;
  contacto: string | undefined;
  categoria!: EmpleadoCategoria;
  puesto!: EmpleadoPuesto;
  genero!: Genero;
  estado: any;
  estadoCivil!: EstadoCivil;
  info!: String;
  fechaAlta!: Date;
  fechaBaja!: Date;

  constructor() {}

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
  } */
}
