import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {IconComponent} from '../../shared/components/icon/icon';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
  imports: [
    NgOptimizedImage,
    IconComponent
  ],
  host: {
    class: 'flex w-full justify-center'
  }
})
export default class Navbar {

}
