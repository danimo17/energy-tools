import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportModule } from '@app/core/import/import.module';
import { UiModule } from '@app/components/ui.module';
import { InvoicesModule } from '../../features/invoices/invoices.module';
import { InvoicesPageComponent } from './invoices-page.component';

@NgModule({
  declarations: [InvoicesPageComponent],
  imports: [
    UiModule,
    ImportModule,
    InvoicesModule,
    RouterModule.forChild([{ path: '', component: InvoicesPageComponent }])
  ]
})
export class InvoicesPageModule {}
