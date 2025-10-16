import {Component} from '@angular/core';
import {IconComponent} from '../../shared/components/icon/icon';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.html',
  imports: [
    IconComponent
  ],
  host: {
    class: 'flex w-full justify-center bg-[#0D0D0D] pt-20 pb-30'
  }
})
export default class Footer {

}
