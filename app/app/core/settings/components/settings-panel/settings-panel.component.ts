import { Component } from '@angular/core';
import { LANGUAGES } from '../../../i18n/i18n.config';
import { TranslateService } from '../../../i18n/services/translate.service';
import { Theme } from '../../../theme/types/theme.types';
import { ThemeService } from '../../../theme/services/theme.service';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.component.html'
})
export class SettingsPanelComponent {
  readonly languages = LANGUAGES;
  readonly themes: Theme[] = ['light', 'dark'];

  constructor(public readonly translate: TranslateService, public readonly theme: ThemeService) {}
}
