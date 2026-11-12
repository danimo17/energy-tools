import { NgModule } from '@angular/core';
import { UiModule } from '@app/components/ui.module';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';

@NgModule({
  declarations: [ImportDialogComponent],
  imports: [UiModule],
  exports: [ImportDialogComponent]
})
export class ImportModule {}
