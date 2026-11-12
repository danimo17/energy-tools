import { Component, ViewEncapsulation } from '@angular/core';
import { CardConfig } from '../card/card.types';
import { OverlayBase } from '../overlay/overlay.base';
import { OverlayPosition } from '../overlay/overlay.types';

@Component({
  selector: 'app-dialog',
  templateUrl: '../overlay/overlay.component.html',
  styleUrls: ['../overlay/overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogComponent extends OverlayBase {
  get position(): OverlayPosition {
    return 'center';
  }
  protected readonly closeOnBackdrop = false;
  protected readonly cardStyle: CardConfig = {};
}
