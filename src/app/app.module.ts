import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import localeEsAR from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAR, 'es-Ar');

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './home/error/error.component';
import { NavbarComponent } from './home/navbar/navbar.component';

import { EmpresaComponent } from './component/empresa/empresa.component';
import { EmpleadoComponent } from './component/empleado/empleado.component';

import { EmpresaModule } from './component/empresa/empresa.module';
import { EmpleadoModule } from './component/empleado/empleado.module';
import { FooterComponent } from './home/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    NavbarComponent,
    EmpresaComponent,
    EmpleadoComponent,
    FooterComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    EmpresaModule,
    EmpleadoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
