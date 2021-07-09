import { EmpleadoPuesto } from "./empleado-puesto.model";

export class Empleado {
  id: number;
  nombre: string = "";
  apellido: string  = "";
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

   constructor(id: number){
    this.id = id;
  }

  getName(): string {
    return "`${this.nombre} ${this.info}`";
  }
}
