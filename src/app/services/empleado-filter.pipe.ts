import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "empleadoFilter",
})
export class EmpleadoFilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: any[], searchText: string): any[] {
    const result = [];

    if (!items) {
      return [];
    }
    if (!searchText || searchText.length < 2 ) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    for (const item of items) {
      if (item.nombre.toLowerCase().indexOf(searchText) > -1 || item.apellido.toLowerCase().indexOf(searchText) > -1) {
        result.push(item);
      }
    }
    return result;

    /*return items.filter(it => {
      return it.toLocaleLowerCase().includes(searchText);
    });*/
  }
}
