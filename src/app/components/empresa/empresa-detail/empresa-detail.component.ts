import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';

import { EmpresaListComponent } from '../empresa-list/empresa-list.component';

@Component({
  selector: 'app-empresa-detail',
  templateUrl: './empresa-detail.component.html',
  styleUrls: ['./empresa-detail.component.css']
})
export class EmpresaDetailComponent implements OnInit {

  empresa: Empresa = new Empresa;

  constructor(
    private empresaService: EmpresaService) {
  }

  ngOnInit(): void {
    this.empresaService.empresaEmitter.subscribe(
      data => {
        this.empresa = data;
      }
    );
  }

  setDatos(e: Empresa):void{
    this.empresa = e;
  }

}
