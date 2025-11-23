import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import routes from './pages/routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideEventPlugins} from '@taiga-ui/event-plugins';

import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {interceptors} from '@/interceptors';
import {AngularYandexMapsModule, YaConfig} from 'angular8-yandex-maps';

const config: YaConfig = {
  apikey: '2d99c38b-e576-4360-bdf7-b3a1717e4cad',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors(interceptors)),
    provideEventPlugins(),
    importProvidersFrom(AngularYandexMapsModule.forRoot(config))
  ]
};
