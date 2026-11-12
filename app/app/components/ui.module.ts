import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '../core/i18n/i18n.module';
import { ButtonListComponent } from './button-list/button-list.component';
import { ButtonComponent } from './button/button.component';
import { CardComponent } from './card/card.component';
import { DescriptionComponent } from './description/description.component';
import { ConfirmHostComponent } from './dialog/confirm-host.component';
import { DialogComponent } from './dialog/dialog.component';
import { DrawerComponent } from './drawer/drawer.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { IconComponent } from './icon/icon.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { TableComponent } from './table/table.component';
import { ToastHostComponent } from './toast/toast-host.component';
import { ToastComponent } from './toast/toast.component';

const COMPONENTS = [
  ButtonListComponent,
  ButtonComponent,
  CardComponent,
  ConfirmHostComponent,
  DescriptionComponent,
  DialogComponent,
  DrawerComponent,
  DropzoneComponent,
  IconComponent,
  PageHeaderComponent,
  TableComponent,
  ToastComponent,
  ToastHostComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, I18nModule],
  exports: [...COMPONENTS, CommonModule, I18nModule]
})
export class UiModule {}
