import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {NgOptimizedImage} from '@angular/common';

@Component({
  templateUrl: 'loyalty-program.html',
  styleUrl: 'loyalty-program.css',
  selector: 'loyalty-program',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    ProfileMenu,
    NgOptimizedImage
  ]
})
export default class LoyaltyProgram {

}
