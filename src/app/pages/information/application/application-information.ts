import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {IconComponent} from '@/components/icon/icon';
import {NgOptimizedImage} from '@angular/common';

@Component({
  templateUrl: 'application-information.html',
  selector: 'application-information',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    IconComponent,
    NgOptimizedImage
  ]
})
export default class ApplicationInformation {

}
