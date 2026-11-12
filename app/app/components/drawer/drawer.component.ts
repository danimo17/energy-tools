import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CardConfig } from '../card/card.types';
import { OverlayBase } from '../overlay/overlay.base';
import { DrawerSide, OverlayPosition } from '../overlay/overlay.types';

@Component({
  selector: 'app-drawer',
  templateUrl: '../overlay/overlay.component.html',
  styleUrls: ['../overlay/overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DrawerComponent extends OverlayBase {
  @Input() side: DrawerSide = 'right';

  protected readonly closeOnBackdrop = true;
  protected readonly cardStyle: CardConfig = { square: true, fullHeight: true };

  get position(): OverlayPosition {
    return this.side;
  }
}
