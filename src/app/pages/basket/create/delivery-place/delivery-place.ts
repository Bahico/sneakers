import {afterNextRender, Component, DestroyRef, inject, input, model, OnDestroy, OnInit, signal} from '@angular/core';
import {YaEvent, YaMapComponent, YaPlacemarkDirective, YaReadyEvent} from 'angular8-yandex-maps';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {DeliveryTypeInputs} from '@/basket/create/delivery-type-inputs/delivery-type-inputs';
import {IconComponent} from '@/components/icon/icon';
import {FormGroup} from '@angular/forms';
import {PaymentForm} from '@/models/basket';
import {debounceTime, Subject} from 'rxjs';
import {CdekService} from '@/services/cdek.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Suggestion} from '@/models/cdek';
import {DeliveryType} from '@/models/order';

@Component({
  selector: 'delivery-place',
  templateUrl: 'delivery-place.html',
  imports: [
    NgClass,
    DeliveryTypeInputs,
    IconComponent,
    NgTemplateOutlet,
    YaMapComponent,
    YaPlacemarkDirective
  ],
})
export class DeliveryPlace implements OnDestroy, OnInit {
  private readonly cdekService = inject(CdekService);
  private readonly destroyRef = inject(DestroyRef);

  form = input.required<FormGroup<PaymentForm>>();
  open = model(false);

  center = signal<[number,number]>([55.751952, 37.600739]);
  radius_meter = signal(8270);
  suggestions = signal<Suggestion[]>([]);
  suggestionId = signal<string>(null);
  locationData = signal<{lat: number; lon: number}>(null);
  delivery_type = signal<DeliveryType>('cdek_pickup');

  private readonly mapChangeEvent = new Subject<[number, number]>();

  constructor() {
    afterNextRender(() => {
      this.mapChangeEvent.next(this.center());
      this.loadCdek();
    })
  }

  ngOnInit() {
    this.subscribeMapEvent();
  }

  ngOnDestroy() {
    this.mapChangeEvent.complete();
  }

  subscribeMapEvent() {
    this.mapChangeEvent
      .pipe(
        debounceTime(300),
      )
      .subscribe(async (data) => {
        this.center.set(data)
        await this.loadSuggestions();
      });
    this.form().controls.delivery_data.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data) {
          this.suggestionId.set(data?.['value']);
          this.locationData.set({lat: data?.['lat'], lon: data?.['lon']});
        } else {
          this.suggestionId.set(null);
          this.locationData.set(null);
        }
      });
    this.form().controls.delivery_type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.delivery_type.set(data);
        this.setLocation();
      });
  }

  async loadSuggestions() {
    const {suggestions} = await this.cdekService.suggestions({
      lat: this.center()[0],
      lon: this.center()[1],
      radius_meters: this.radius_meter()
    });
    this.suggestions.set(suggestions);
  }

  loadCdek() {
    this.cdekService.cdeks({
      country_code: 'RU',
      radius: 1,
      latitude: this.center()[0],
      longitude: this.center()[1],
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        console.log(data);
      })
  }

  onPlacemarkReady(placemark: any, suggestion: Suggestion) {
    placemark.target.events.add('click', () => {
      this.onPlacemarkClick(suggestion);
    });
  }

  onPlacemarkClick(suggestion: Suggestion) {
    this.form().controls.delivery_data.setValue({
      value: suggestion.value,
      address: suggestion.data.address_str,
      latitude: suggestion.data.geo_lat,
      longitude: suggestion.data.geo_lon
    });
  }

  onMapReady(map: YaReadyEvent<ymaps.Map>) {
    if (!this.suggestionId) return;

    const selected = this.suggestions().find(x => x.value === this.suggestionId());
    if (!selected) return;

    map.target.setCenter([selected.data.geo_lat, selected.data.geo_lon], map.target.getZoom(), {
      duration: 200
    });
  }

  onChange(event: YaEvent<ymaps.Map> | YaReadyEvent<ymaps.Map>) {
    this.mapChangeEvent.next(<[number, number]>event.target.getCenter());

    const radius = this.cdekService.getVisibleRadiusMeters(event);
    this.radius_meter.set(Math.round(radius));
  }

  onMapClick(e: YaEvent<ymaps.Map>): void {
    if (this.delivery_type() !== 'cdek_courier') {
      return;
    }
    const { event } = e;

    if (!this.locationData()) {
      const coords = event.get('coords');

      this.setLocation({
        lat: coords[0].toPrecision(6),
        lon: coords[1].toPrecision(6)
      });
    } else {
      this.setLocation();
    }
  }

  setLocation(data?: {lat: number, lon: number}) {
    this.form().controls.delivery_data.setValue(data);
  }
}
