import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Empresa } from 'src/app/model/empresa';
import { EmpresaService } from 'src/app/service/empresa.service';
import { EmpleadoDetailComponent } from '../../empleado/empleado-detail/empleado-detail.component';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css']
})
export class EmpresaListComponent implements OnInit {

    selectEmpresa: Empresa = new Empresa;
    empresas: Observable<Empresa[]> | undefined;

    constructor(
      private empresaService: EmpresaService) {
    }

    ngOnInit(): void {
      this.reloadData();
    }

    reloadData() {
      this.empresas = this.empresaService.getList();
    }

    rowSelected(e:Empresa):void{
      this.selectEmpresa = e;
      this.empresaService.setEmpresa(this.selectEmpresa);
      console.log(this.selectEmpresa.nombre);
      /* this.empresaDetail.setDatos(this.selectEmpresa); */
    }

}
