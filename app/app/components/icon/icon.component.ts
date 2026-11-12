import { Component, Input } from '@angular/core';
import { ICONS } from './icons';
import { IconName } from './icon.types';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() name!: IconName;

  get paths(): string[] {
    return ICONS[this.name];
  }
}
