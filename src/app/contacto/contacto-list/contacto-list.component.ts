import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ContactoDetailsComponent } from '../contacto-details/contacto-details.component';
import { ContactoService } from '../contacto.service';
import { Contacto } from '../contacto';



@Component({
  selector: 'app-contacto-list',
  templateUrl: './contacto-list.component.html',
  styleUrls: ['./contacto-list.component.css']
})

export class ContactoListComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  contactos: Observable<Contacto[]>;

  constructor(private contactoService: ContactoService, private router: Router) { }

  ngOnInit(): void {
    this.reloadData();

    this.dtOptions = {
      pagingType: 'full_numbers'
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  reloadData() {
    // this.contactos = this.contactoService.getContactoList();
    this.contactoService.getContactoList().subscribe(data => {
      this.contactos = data;
      this.dtTrigger.next();
    });
  }

  contactoDetails(id: number) {
    this.router.navigate(['details', id]);
  }

}
