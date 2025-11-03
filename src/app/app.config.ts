import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import routes from './pages/routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideEventPlugins} from '@taiga-ui/event-plugins';

import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {interceptors} from '@/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors(interceptors)),
    provideEventPlugins(),
  ]
};
