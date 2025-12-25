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
import {provideYaConfig, YaConfig} from 'angular8-yandex-maps';

const config: YaConfig = {
  apikey: '76109729-bc49-47c6-b10d-6a78a66b5376',
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
    provideYaConfig(config)
  ]
};
