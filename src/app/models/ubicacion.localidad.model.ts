export interface ILocalidad {
  id: number
  name: string,
  zipcode: string,
  state: IProvincia,
  info: string
}

export interface IProvincia {
  id: number,
  name: string,
  code: string
}

export class Localidad {
  idLocalidad!: number;
  nombre!: string;
  codigoPostal!: string;
  provincia!: Provincia;
  constructor() { }
}

export class Provincia {
  idProvincia!: Number;
  nombre!: String;
  codigo!: String;
  constructor() { }
}
