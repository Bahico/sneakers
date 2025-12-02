import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {ConfigInfos} from '@/components/config-infos/config-infos';

@Component({
  templateUrl: 'loyalty-program.html',
  selector: 'loyalty-program',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    ProfileMenu,
    ConfigInfos
  ]
})
export default class LoyaltyProgram {

}
