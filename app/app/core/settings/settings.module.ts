import { NgModule } from '@angular/core';
import { UiModule } from '@app/components/ui.module';
import { SettingsDrawerComponent } from './components/settings-drawer/settings-drawer.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';

@NgModule({
  declarations: [SettingsDrawerComponent, SettingsPanelComponent],
  imports: [UiModule],
  exports: [SettingsDrawerComponent, SettingsPanelComponent]
})
export class SettingsModule {}
