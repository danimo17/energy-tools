import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DescriptionComponent {
  @Input() title = '';
  @Input() text = '';
}
