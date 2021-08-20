import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root",
})
export class DateAuxService {

  calcAntiguedad(fechaX: string): number {
    let fecha = new Date(fechaX);
    let edad: number = 0;
    try {
      const hoy = new Date();
      edad = hoy.getFullYear() - fecha.getFullYear();
      const m = hoy.getMonth() - fecha.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
        edad--;
      }
    } catch (error) {
      console.error("Log error", error);
    }
    return edad;
  }

}
