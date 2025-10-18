import {Component} from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {IconComponent} from '../../shared/components/icon/icon';
import {TuiDropdownDirective, TuiDropdownManual, TuiDropdownOptionsDirective} from '@taiga-ui/core';
import {TuiActiveZone, TuiObscured} from '@taiga-ui/cdk';

@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html',
  styleUrl: 'navbar.css',
  imports: [
    NgOptimizedImage,
    IconComponent,
    TuiDropdownDirective,
    TuiDropdownManual,
    TuiObscured,
    TuiActiveZone,
    TuiDropdownOptionsDirective,
    NgClass
  ],
  host: {
    class: 'flex w-full justify-center'
  }
})
export default class Navbar {
  protected open = false;

  protected onClick(): void {
    this.open = !this.open;
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  protected onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }
}
