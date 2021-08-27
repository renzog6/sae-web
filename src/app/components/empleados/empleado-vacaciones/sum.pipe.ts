import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sumDias"
})
export class SumPipe implements PipeTransform {
  transform(items: any[], attr: string): any {
    return items.reduce((a, b) => a + b[attr], 0);
  }
}

@NgModule({
  declarations: [SumPipe],
  exports: [SumPipe]
})
export class SumPipeModule { }
