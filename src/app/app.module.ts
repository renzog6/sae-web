import { BrowserModule } from '@angular/platform-browser';
import { NgModule,  LOCALE_ID } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';

import localeEsAR from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAR, 'es-Ar');

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

import { ContactoListComponent } from './contacto/contacto-list/contacto-list.component';
import { ContactoDetailsComponent } from './contacto/contacto-details/contacto-details.component';
import { EmpresaListComponent } from './empresa/empresa-list/empresa-list.component';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { NavbarComponent } from './home/navbar/navbar.component';

import { LoginComponent } from './home/login/login.component';
import { HomeComponent } from './home/home.component';
import { Page404Component } from './home/page404/page404.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactoListComponent,
    ContactoDetailsComponent,
    EmpresaListComponent,
    SidebarComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    DataTablesModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es-Ar' }],
  //providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
