import { Component, EventEmitter, Output } from '@angular/core';
import { MenuItem } from '../../types/menu.types';

const MENU_ITEMS: MenuItem[] = [
  { path: '/dashboard', label: 'pages.dashboard', icon: 'grid' },
  { path: '/invoices', label: 'pages.invoices', icon: 'file' }
];

@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.scss']
})
export class MenuNavComponent {
  readonly items = MENU_ITEMS;

  @Output() navigate = new EventEmitter<void>();
  @Output() settings = new EventEmitter<void>();
}
