export class IDiasDisponibles {
  id!: number;
  dias!: number;
}

export interface IDetailVacation {
  name: string;
  value: number;
}
/* export interface IVacacion {
  fecha: Date;
  detalle: string;
  dias: number;
  anio: number;
  info: string;
  fechaToma: Date;
}
 */
export class Vacacion {
  idVacacion!: number;
  fecha!: Date;
  detalle!: string;
  dias!: number;
  anio!: number;
  info!: string;
  fechaToma!: Date;
  fechaLiquida!: Date;
  created!: Date;
  updated!: Date;
}
