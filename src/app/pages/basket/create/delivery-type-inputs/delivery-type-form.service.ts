import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class DeliveryTypeFormService {
  courier = {
    address: null,
    apartment: null,
    entrance: null,
    floor: null,
    intercom: null,
    comment: null,
  };
}
