import { Injectable } from '@angular/core';
import { CrudStore } from '@app/core/crud/crud.store';
import { InvoicesService } from '../services/invoices.service';
import { Invoice } from '../types/invoices.types';

@Injectable({ providedIn: 'root' })
export class InvoicesStore extends CrudStore<Invoice> {
  constructor(service: InvoicesService) {
    super(service);
  }
}
