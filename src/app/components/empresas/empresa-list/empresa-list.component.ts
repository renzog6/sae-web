import { AfterViewInit, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.scss']
})
export class EmpresaListComponent implements OnInit, AfterViewInit {

  isLoading: boolean = true;

  columnas: string[] = ['idEmpresa', 'nombre', 'cuit', 'test', 'details'];
  empresas!: Empresa[];
  //dataSource = new MatTableDataSource(this.empresas);
  //dataSource!: MatTableDataSource<Empresa>();

  dataSource = new MatTableDataSource<Empresa>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private empresaSvc: EmpresaService
  ) { }

  ngOnInit(): void {
    this.loadEmpresas();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private loadEmpresas(): void {
    this.empresaSvc.getList()
      .subscribe(
        (res: Empresa[]) => {
          this.dataSource.data = res,
            this.isLoading = false
        },
        error => this.isLoading = false
      );
  }

  redirectToDetails(id: number): void {

  }

  getTest(emp: Empresa): string {
    return "XXX";
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
