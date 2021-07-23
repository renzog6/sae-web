import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from "@angular/common";
import localeEsAR from "@angular/common/locales/es-AR";
registerLocaleData(localeEsAR, "es-AR");

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { HomeComponent } from "./home/home.component";
import { ErrorComponent } from "./home/error/error.component";
import { NavbarComponent } from "./home/navbar/navbar.component";

import { EmpresaModule } from "./components/empresa/empresa.module";
import { EmpleadoModule } from "./components/empleado/empleado.module";
import { FooterComponent } from "./home/footer/footer.component";

import { CustomDateParserFormatter } from "./services/date-formatter.service";
import { FilterPipe } from "./services/filter.pipe";



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    EmpresaModule,
    EmpleadoModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "es-AR" },
  // {provide: NgbDateAdapter, useClass: CustomAdapter},
   {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
