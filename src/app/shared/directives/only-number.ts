import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[onlyNumber]'
})
export class OnlyNumber {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Faqat raqamlarni qoldiramiz
    const filteredValue = value.replace(/[^0-9]/g, '');

    // Agar o‘zgarsa, FormControl qiymatini yangilaymiz
    if (filteredValue !== value) {
      input.value = filteredValue;
      this.ngControl?.control?.setValue(filteredValue, { emitEvent: false });
    }
  }
}
