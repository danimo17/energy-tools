import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '@app/core/crud/crud.service';
import { INVOICES_API_URL } from '../invoices.constants';
import { Invoice } from '../types/invoices.types';

@Injectable({ providedIn: 'root' })
export class InvoicesService extends CrudService<Invoice> {
  constructor(http: HttpClient) {
    super(http, INVOICES_API_URL);
  }
}
