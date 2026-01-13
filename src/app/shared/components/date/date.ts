import {Component, forwardRef, input, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {TuiInputDate} from '@taiga-ui/kit';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TuiCalendar, TuiDropdownDirective, TuiDropdownOpen} from '@taiga-ui/core';
import {TuiDay} from '@taiga-ui/cdk';

@Component({
  templateUrl: 'date.html',
  selector: 'app-date',
  imports: [
    IconComponent,
    TuiInputDate,
    TuiCalendar,
    FormsModule,
    TuiDropdownDirective,
    TuiDropdownOpen
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true
    }
  ]
})
export class DateComponent implements ControlValueAccessor {
  placeholder = input<string>();
  maxDate = input<TuiDay>();

  open = signal(false);
  selectedDate = signal<TuiDay | null>(null);
  disabled = signal(false);

  private onChange = (value: string | null) => {};
  private onTouched = () => {};

  protected onDayClick(day: TuiDay): void {
    if (this.disabled()) {
      return;
    }
    this.selectedDate.set(day);
    const dateString = this.tuiDayToIsoString(day);
    this.onChange(dateString);
    this.onTouched();
    this.open.set(false);
  }

  writeValue(value: string | TuiDay | null): void {
    if (value === null || value === undefined) {
      this.selectedDate.set(null);
      return;
    }

    if (value instanceof TuiDay) {
      this.selectedDate.set(value);
    } else if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        this.selectedDate.set(TuiDay.fromLocalNativeDate(date));
      } else {
        this.selectedDate.set(null);
      }
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private tuiDayToIsoString(day: TuiDay): string {
    const date = day.toLocalNativeDate();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayOfMonth}`;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
