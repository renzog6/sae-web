import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Vacacion } from 'src/app/models/vacacion.models';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { VacacionService } from 'src/app/services/vacacion.services';
import { SuccessDialogComponent } from 'src/app/layout/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-vacacion-delete',
  templateUrl: './vacacion-delete.component.html',
  styleUrls: ['./vacacion-delete.component.scss']
})
export class VacacionDeleteComponent implements OnInit {

  private dialogConfig!: MatDialogConfig<any>;
  vacacion!: Vacacion;

  constructor(
    private dialogRef: MatDialogRef<VacacionDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Vacacion,
    private vacacionSvc: VacacionService,
    private router: Router,
    private dialog: MatDialog,
    private errorSvc: ErrorHandlerService,
  ) {
    this.vacacion = data;
  }

  ngOnInit(): void {
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {}
    }
  }

  onCancel(): void {
    this.dialogRef.close();
    this.router.navigate(['/empleados/vacaciones'])
  }

  public deleteVacacion(): void {
    this.vacacionSvc.delete(this.vacacion.idVacacion)
      .subscribe(res => {
        let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

        this.dialogRef.afterClosed()
          .subscribe(result => {
            this.router.navigate(['/empleados/vacaciones'])
          });
        this.dialogRef.close();
      },
        (error) => {
          this.errorSvc.dialogConfig = this.dialogConfig;
          this.errorSvc.handleError(error);
          this.dialogRef.close();
        })
  }


}
