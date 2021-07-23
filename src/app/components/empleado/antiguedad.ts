import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-antiguedad",
  template: `{{ antiguedad }}`,
})
export class AntiguedadComponent implements OnInit {
  antiguedad: number = 0;
  @Input() fechaIn!: Date; // = new Date();
  fecha!: Date;

  ngOnInit(): void {
    this.fecha = new Date(this.fechaIn);
    this.antiguedad = this.getAntiguedad();
  }

  getAntiguedad(): number {
    let edad: number = 0;
    try {
      const hoy = new Date();
      edad = hoy.getFullYear() - this.fecha.getFullYear();
      const m = hoy.getMonth() - this.fecha.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < this.fecha.getDate())) {
        edad--;
      }
    } catch (error) {
      console.error("Log error", error);
    }
    return edad;
  }
}
