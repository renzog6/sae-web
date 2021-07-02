import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactoListComponent } from './contacto/contacto-list/contacto-list.component';
import { ContactoDetailsComponent } from './contacto/contacto-details/contacto-details.component';

import { EmpresaListComponent } from './empresa/empresa-list/empresa-list.component';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { Page404Component } from './home/page404/page404.component';



const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },  
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contactos', component: ContactoListComponent },
  { path: 'details/:id', component: ContactoDetailsComponent },
  { path: 'empresas', component: EmpresaListComponent },
  { path: 'empleados', loadChildren: () => import('./empleados/empleados.module').then(m => m.EmpleadosModule) },
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
