import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs, TuiCheckbox} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {ProfileMenu} from '@/profile/components/menu/profile-menu';
import {IconComponent} from '@/components/icon/icon';
import {FormControl, FormGroup, FormsModule} from '@angular/forms';
import {Profile} from '@/models/profile';

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

  form = new FormGroup<{[key in keyof Profile]?: any}>({
    username: new FormControl(null),
    phone: new FormControl(null),
    first_name: new FormControl(null),
    last_name: new FormControl(null),
    surname: new FormControl(null),
  })
}
