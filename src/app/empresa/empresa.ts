import { Observable } from 'rxjs';
import { Contacto } from '../contacto/contacto';

export class Empresa {
  id: number;
  nombre: string;
  razonSocial: string;
  cuit: string;
  contactoList: Observable<Contacto[]>;
  direccionList: any;
}
