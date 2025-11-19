import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {IconComponent} from '@/components/icon/icon';

@Component({
  templateUrl: 'contact-information.html',
  selector: 'contact-information',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    IconComponent
  ]
})
export default class ContactInformation {

}
