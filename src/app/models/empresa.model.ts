import { Contacto } from './contacto.model';

export class Empresa {
  idEmpresa!: number;
  nombre!: string;
  razonSocial!: string;
  cuit!: string;
  contactoList!: Contacto[];
  direccionList: any;

  getName(): string {
    return `${this.nombre} ${this.cuit}`;
  }
}


