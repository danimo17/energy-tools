import { NgModule } from '@angular/core';
import { UiModule } from '@app/components/ui.module';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { InvoiceTableComponent } from './components/invoice-table/invoice-table.component';

const COMPONENTS = [InvoiceDetailComponent, InvoiceTableComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [UiModule],
  exports: COMPONENTS
})
export class InvoicesModule {}
