import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {Cdek, CdekCredentials, Suggestion} from '@/models/cdek';
import {YaEvent, YaReadyEvent} from 'angular8-yandex-maps';

@Injectable({providedIn: 'root'})
export class CdekService {
  private readonly http = inject(HttpClient);

  cdeks(params: CdekCredentials) {
    return this.http.get<Cdek[]>(getEndpoint('orders/cdek/delivery-points'), {params: {...params, type_code: "PVZ"}});
  }

  async suggestions(params: { lat?: number; lon?: number; radius_meters?: number; }): Promise<{
    suggestions: Suggestion[]
  }> {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/postal_unit";
    const token = "4c58255bbc6b63d411bb06ebf3ccaeb326c97ebd";
    const query = "почта";

    const options: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + token
      },
      body: JSON.stringify({...params, query, filters: [{type_code: "ГОПС"}]})
    }

    const response = await fetch(url, options);
    return await response.json();
  }

  async suggestionsWithQuery(query: string): Promise<{ suggestions: Suggestion[] }> {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/postal_unit";
    const token = "4c58255bbc6b63d411bb06ebf3ccaeb326c97ebd";

    const options: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + token
      },
      body: JSON.stringify({query})
    }

    const response = await fetch(url, options);
    return await response.json();
  }

  getVisibleRadiusMeters(map: YaEvent<ymaps.Map> | YaReadyEvent<ymaps.Map>) {
    const center = map.target.getCenter(); // [lat, lon]
    const bounds = map.target.getBounds(); // [[swLat, swLon], [neLat, neLon]]

    const ne = bounds[1];

    const topCenter = [ne[0], center[1]];

    const rightCenter = [center[0], ne[1]];

    const distTop = ymaps.coordSystem.geo.getDistance(center, topCenter);
    const distRight = ymaps.coordSystem.geo.getDistance(center, rightCenter);

    return Math.max(distTop, distRight);
  }
}
