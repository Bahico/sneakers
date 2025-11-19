import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs, TuiCheckbox} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {IconComponent} from '@/components/icon/icon';
import {FormsModule} from '@angular/forms';

@Component({
  templateUrl: 'profile-edit.html',
  selector: 'profile-edit',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    ProfileMenu,
    IconComponent,
    TuiCheckbox,
    FormsModule
  ]
})
export default class ProfileEdit {
  checked = false;
}
