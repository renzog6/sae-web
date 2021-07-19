import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { registerLocaleData } from "@angular/common";
import localeEsAR from "@angular/common/locales/es-AR";
registerLocaleData(localeEsAR, "es-AR");

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

import { HomeComponent } from "./home/home.component";
import { ErrorComponent } from "./home/error/error.component";
import { NavbarComponent } from "./home/navbar/navbar.component";

import { EmpresaComponent } from "./components/empresa/empresa.component";

import { EmpresaModule } from "./components/empresa/empresa.module";
import { EmpleadoModule } from "./components/empleado/empleado.module";
import { FooterComponent } from "./home/footer/footer.component";

import { CustomAdapter, CustomDateParserFormatter } from "./services/date-formatter.service"


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    NavbarComponent,
    EmpresaComponent,
    FooterComponent,

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
    { provide: localeEsAR, useValue: "es-AR-Ar" },
  // {provide: NgbDateAdapter, useClass: CustomAdapter},
   {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
