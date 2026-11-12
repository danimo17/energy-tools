import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@app/components/ui.module';
import { DashboardPageComponent } from './dashboard-page.component';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [UiModule, RouterModule.forChild([{ path: '', component: DashboardPageComponent }])]
})
export class DashboardPageModule {}
