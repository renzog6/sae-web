import { Observable } from 'rxjs';
import { Contacto } from './contacto.model';

export class Empresa {
  id: number | undefined;
  nombre: string ="";
  razonSocial: string | undefined;
  cuit: string | undefined;
  contactoList: Observable<Contacto[]> | undefined;
  direccionList: any;

  getName(): string {
    return `${this.nombre} ${this.cuit}`;
  }

}
