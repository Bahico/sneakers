import {afterNextRender, Component, inject, input, OnDestroy, output, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {TuiSegmented} from '@taiga-ui/kit';
import {DeliveryTypeKeys, deliveryTypeValues} from '@/models/order';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PaymentForm} from '@/models/basket';
import {TuiDataList, TuiDropdownDirective, TuiDropdownManual} from '@taiga-ui/core';
import {CdekService} from '@/services/cdek.service';
import {Suggestion} from '@/models/cdek';
import {debounceTime, filter, Subject} from 'rxjs';
import {TuiActiveZone, TuiObscured} from '@taiga-ui/cdk';
import {DeliveryTypeFormService} from './delivery-type-form.service';

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
    TuiActiveZone,
    ReactiveFormsModule
  ]
})
export class DeliveryTypeInputs implements OnDestroy {
  private readonly cdekService = inject(CdekService);
  protected readonly formService = inject(DeliveryTypeFormService);

  form = input.required<FormGroup<PaymentForm>>();
  readonly = input<boolean>(false);
  openModal = output<boolean>();

  openSuggestions = signal<boolean>(false);
  suggestionSearch = signal<string>('');
  suggestions = signal<Suggestion[]>([]);

  cdekName = signal('');

  protected readonly deliveryTypeKeys = DeliveryTypeKeys;
  protected readonly deliveryTypeValues = deliveryTypeValues;
  protected readonly suggestionSearchEvent$ = new Subject<void>();

  constructor() {
    afterNextRender(() => {
      this.subscribeDeliveryDataEvent();
      this.formService.courier = {...this.formService.courier, ...(this.form().controls.delivery_data.value || {})};
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

  subscribeDeliveryDataEvent() {
    this.form()
      .controls
      .delivery_data
      .valueChanges
      .subscribe(data => {
        switch (this.form().controls.delivery_type.value) {
          case 'cdek_pickup': {
            if (data) {
              this.cdekName.set(data?.['name'] + ' ' + data?.['address'])
            }
            break;
          } case 'russian_post': {
            this.suggestionSearch.set(data?.['address']);
            break;
          } case 'cdek_courier': {
            this.formService.courier.address = data?.['address'];
            break;
          }
        }
      })
  }

  changeDeliveryData() {
    this.form().controls.delivery_data.setValue({
      ...(this.form().controls.delivery_data.value || {}),
      ...this.formService.courier
    });
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
