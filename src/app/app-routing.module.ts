import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { ErrorComponent } from "./home/error/error.component";

import { EmpresaComponent } from "./components/empresa/empresa.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "empresa", component: EmpresaComponent },
  {
    path: "empleado",
    loadChildren: () =>
      import(`./components/empleado/empleado.module`).then(
        (m) => m.EmpleadoModule
      ),
  },
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "**", component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
