import { Contacto } from "./contacto.model";
import { Direccion } from "./ubicacion.direccion.model";
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
  cellPhone: string;
  email: string;
};

export class Empleado {
  idPersona!: number;
  nombre!: string;
  apellido!: string;
  nacimiento!: Date;
  dni!: string;
  cuil!: string;
  domicilio!: Direccion;
  contactoList!: Contacto[];
  categoria!: EmpleadoCategoria;
  puesto!: EmpleadoPuesto;
  genero!: Genero;
  estado!: Estado;
  estadoCivil!: EstadoCivil;
  info!: string;
  fechaAlta!: Date;
  fechaBaja!: Date;

  constructor() { }
};
