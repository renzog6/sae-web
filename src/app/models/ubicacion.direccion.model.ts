import { ILocalidad, Localidad } from "./ubicacion.localidad.model";

export interface IDireccion {
  id: number,
  name: string,
  street: string,
  number: string,
  info: string,
  city: ILocalidad
}
export class Direccion {
  idDireccion!: Number;
  nombre!: String;
  calle!: string;
  numero!: string;
  localidad!: Localidad;
  codigo!: String;
  info!: String;

  constructor() { }
}
