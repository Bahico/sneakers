import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'product/detail/:spuId',
    renderMode: RenderMode.Client
  },
  {
    path: 'product/:gender/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'home/:gender',
    renderMode: RenderMode.Client
  },
  {
    path: 'profile/orders/:id',
    renderMode: RenderMode.Client
  },
];
