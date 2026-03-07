import {afterNextRender, Component, DestroyRef, effect, inject, input, model, OnDestroy, signal} from '@angular/core';
import {YaEvent, YaMapComponent, YaPlacemarkDirective, YaReadyEvent} from 'angular8-yandex-maps';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {DeliveryTypeInputs} from '@/basket/create/delivery-type-inputs/delivery-type-inputs';
import {IconComponent} from '@/components/icon/icon';
import {FormGroup} from '@angular/forms';
import {PaymentForm} from '@/models/basket';
import {debounceTime, Subject} from 'rxjs';
import {CdekService} from '@/services/cdek.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Cdek, Suggestion} from '@/models/cdek';
import {DeliveryType} from '@/models/order';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';

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
export class DeliveryPlace implements OnDestroy {
  protected readonly context = injectContext<TuiDialogContext<FormGroup<PaymentForm>, void>>({optional: true});
  private readonly cdekService = inject(CdekService);
  private readonly destroyRef = inject(DestroyRef);

  formGroup = input<FormGroup<PaymentForm>>(null, {alias: 'form'});
  open = model(false);

  form = signal<FormGroup<PaymentForm>>(null);
  center = signal<[number, number]>([55.751952, 37.600739]);
  radius_meter = signal(8270);
  cdeks = signal<Cdek[]>([]);
  cdekId = signal<string>(null);
  suggestions = signal<Suggestion[]>([]);
  suggestionId = signal<string>(null);
  locationData = signal<{ lat: number; lon: number }>(null);
  delivery_type = signal<DeliveryType>('cdek_pickup');

  private readonly mapChangeEvent = new Subject<[number, number]>();

  constructor() {
    afterNextRender(() => {
      if (this.context?.data) {
        this.form.set(this.context.data);
      }
      this.subscribeTypeEvent();
      this.subscribeMapEvent();
      this.mapChangeEvent.next(this.center());
    });
    effect(() => {
      if (this.formGroup()) {
        this.form.set(this.formGroup());
      }
    });
  }

  ngOnDestroy() {
    this.mapChangeEvent.complete();
  }

  subscribeTypeEvent() {
    this.form().controls.delivery_type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (data) => {
        this.delivery_type.set(data);
        this.setLocation();
        await this.loadLocations();
      })
  }

  subscribeMapEvent() {
    this.mapChangeEvent
      .pipe(debounceTime(800))
      .subscribe(async (data) => {
        this.center.set(data);
        await this.loadLocations();
      });
    this.form().controls.delivery_data.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (this.delivery_type() === 'cdek_pickup') {
          if (data) {
            this.cdekId.set(data?.['value']);
          } else {
            this.cdekId.set(null);
          }
        } else {
          if (data) {
            this.suggestionId.set(data?.['value']);
            this.locationData.set({lat: data?.['lat'], lon: data?.['lon']});
          } else {
            this.suggestionId.set(null);
            this.locationData.set(null);
          }
        }
      });
  }

  async loadLocations() {
    if (this.delivery_type() === 'cdek_pickup') {
      this.loadCdek();
    } else if (this.delivery_type() === 'russian_post') {
      await this.loadSuggestions();
    }
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
        this.cdeks.set(data);
      })
  }

  onPlacemarkReadyCdek(placemark: any, cdek: Cdek) {
    placemark.target.events.add('click', () => {
      this.onPlacemarkClickCdek(cdek);
    });
  }

  onPlacemarkClickCdek(cdek: Cdek) {
    this.form().controls.delivery_data.setValue({
      value: cdek.uuid,
      address: cdek.location.address_full,
      latitude: cdek.location.latitude,
      longitude: cdek.location.longitude,
      phones: cdek.phones,
      name: cdek.name,
    });
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

  async onMapClick(e: YaEvent<ymaps.Map>) {
    if (this.delivery_type() !== 'cdek_courier') {
      return;
    }
    const {event} = e;

    if (!this.locationData()) {
      const coords = event.get('coords');

      const res = await ymaps.geocode(coords);

      const firstGeoObject = res.geoObjects.get(0);
      const address = firstGeoObject.properties.get('name') + ' ' + firstGeoObject.properties.get('description');

      this.setLocation({
        lat: coords[0].toPrecision(6),
        lon: coords[1].toPrecision(6),
        address: address
      });
    } else {
      this.setLocation();
    }
  }

  setLocation(data?: { lat: number, lon: number; address: string }) {
    this.form().controls.delivery_data.setValue(data);
  }
}
