import {Directive, HostListener, output} from '@angular/core';

@Directive({ selector: '[checkMouseLeave]' })
export class MouseLeaveDirective {
  onLeaved = output<void>();

  @HostListener('mouseleave')
  onMouseLeave() {
    this.onLeaved.emit();
  }
}
