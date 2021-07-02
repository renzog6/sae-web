import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa';
import { Contacto } from 'src/app/contacto/contacto';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css']
}) 

export class EmpresaListComponent implements OnInit {

  titulo: string;
  empresas: Observable<Empresa[]>;

  constructor(private empresaService: EmpresaService, private router: Router) { 
    this.titulo = 'Empresa';
  }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.empresas = this.empresaService.getList();
  }

}
