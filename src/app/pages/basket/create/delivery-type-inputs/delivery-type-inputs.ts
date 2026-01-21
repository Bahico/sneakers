import {afterNextRender, Component, DestroyRef, inject, input, OnDestroy, output, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {TuiSegmented} from '@taiga-ui/kit';
import {DeliveryTypeKeys, deliveryTypeValues} from '@/models/order';
import {FormGroup, FormsModule} from '@angular/forms';
import {PaymentForm} from '@/models/basket';
import {TuiDataList, TuiDropdownDirective, TuiDropdownManual} from '@taiga-ui/core';
import {CdekService} from '@/services/cdek.service';
import {Suggestion} from '@/models/cdek';
import {debounceTime, Subject} from 'rxjs';
import {TuiActiveZone, TuiObscured} from '@taiga-ui/cdk';

@Component({
  templateUrl: 'delivery-type-inputs.html',
  selector: 'delivery-type-inputs',
  imports: [
    IconComponent,
    TuiSegmented,
    TuiDataList,
    TuiDropdownDirective,
    FormsModule,
    TuiDropdownManual,
    TuiObscured,
    TuiActiveZone
  ]
})
export class DeliveryTypeInputs implements OnDestroy {
  private readonly cdekService = inject(CdekService);

  form = input.required<FormGroup<PaymentForm>>();
  readonly = input<boolean>(false);
  openModal = output<boolean>();

  openSuggestions = signal<boolean>(false);
  suggestionSearch = signal<string>('');
  suggestions = signal<Suggestion[]>([]);

  protected readonly deliveryTypeKeys = DeliveryTypeKeys;
  protected readonly deliveryTypeValues = deliveryTypeValues;
  protected readonly suggestionSearchEvent$ = new Subject<void>();

  constructor() {
    afterNextRender(() => {
      this.suggestionSearchEvent$
        .pipe(debounceTime(500))
        .subscribe(async () => {
          await this.loadSuggestions();
        });
    })
  }

  ngOnDestroy() {
    this.suggestionSearchEvent$.complete();
  }

  async loadSuggestions() {
    const {suggestions} = await this.cdekService.suggestionsWithQuery(this.suggestionSearch());

    this.suggestions.set(suggestions);
  }

  selectSuggestion(suggestion: Suggestion) {
    this.openSuggestions.set(false);
    this.form().controls.delivery_data.setValue({
      value: suggestion.value,
      address: suggestion.data.address_str,
      latitude: suggestion.data.geo_lat,
      longitude: suggestion.data.geo_lon
    });
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.openSuggestions.set(false);
    }
  }

  protected onActiveZone(active: boolean): void {
    this.openSuggestions.set(active && this.openSuggestions());
  }
}
