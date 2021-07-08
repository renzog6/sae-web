import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EmpleadoDetailComponent } from '../../empleado/empleado-detail/empleado-detail.component';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css']
})
export class EmpresaListComponent implements OnInit {

  empresas: Observable<Empresa[]> | undefined;
    selectEmpresa: Empresa = new Empresa;
    currentIndex?: Number;

    constructor(
      private empresaService: EmpresaService) {}

    ngOnInit(): void {
      this.reloadData();
    }

    reloadData() {
      this.empresas = this.empresaService.getList();
    }

    rowSelected(e:Empresa, index:Number):void{
      this.selectEmpresa = e;
      this.empresaService.setEmpresa(this.selectEmpresa);
      console.log(this.selectEmpresa.nombre);
      this.currentIndex = index;
      /* this.empresaDetail.setDatos(this.selectEmpresa); */
    }

}
