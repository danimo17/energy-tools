import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@app/components/ui.module';
import { MenuNavComponent } from './components/menu-nav/menu-nav.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

@NgModule({
  declarations: [MenuNavComponent, SideMenuComponent],
  imports: [RouterModule, UiModule],
  exports: [SideMenuComponent]
})
export class MenuModule {}
