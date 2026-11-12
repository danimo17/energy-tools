import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UiModule } from './components/ui.module';
import { INVOICES_MOCK_PROVIDER } from './features/invoices/services/invoices.mock';
import { MenuModule } from './core/menu/menu.module';
import { SettingsModule } from './core/settings/settings.module';
import { THEME_PROVIDER } from './core/theme/theme.provider';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, UiModule, MenuModule, SettingsModule],
  providers: [INVOICES_MOCK_PROVIDER, THEME_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule {}
