import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {Banner} from '@/models/banner';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private readonly http = inject(HttpClient);

  banners() {
    return this.http.get<{top_banners: Banner[]; bottom_banners: Banner[]}>(getEndpoint('banners/'));
  }
}
