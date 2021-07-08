import { Injectable,Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  empresa: Empresa = new Empresa;
  @Output()
  empresaEmitter = new EventEmitter<Empresa>();

  setEmpresa(nuevaEmpresa:Empresa):void{
    this.empresa = nuevaEmpresa;
    this.cambiarEmpresa();
  }

  cambiarEmpresa():void{
    this.empresaEmitter.emit(this.empresa);
  }

  private apiUrl = environment.baseUrl+'/api/empresa/list';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl);
  }

  getList(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUrl():String{
    return this.apiUrl;
  }

}
