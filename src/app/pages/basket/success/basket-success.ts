import { Component, ViewEncapsulation } from '@angular/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { TuiLink } from '@taiga-ui/core';
import { TuiItem } from '@taiga-ui/cdk';
import { RouterLink } from '@angular/router';
import { injectRegisterIcons, SvgIconComponent } from '@ngneat/svg-icon';
import { telegramIcon } from '@/telegram';
import { callIcon } from '@/call';
import { whatsappIcon } from '@/whatsapp';
import { telegramCircleIcon } from '@/telegram-circle';
import { youtubeIcon } from '@/youtube';
import { instagramIcon } from '@/instagram';

@Component({
  selector: 'basket-success',
  templateUrl: 'basket-success.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'flex w-full justify-center' },
  imports: [TuiBreadcrumbs, TuiLink, TuiItem, RouterLink, SvgIconComponent]
})
export default class BasketSuccess {
  constructor() {
    injectRegisterIcons([telegramIcon, callIcon, whatsappIcon, telegramCircleIcon, youtubeIcon, instagramIcon])
  }
}
