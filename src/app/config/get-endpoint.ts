import {environment} from 'environments';

export function getEndpoint(endpoint: string, version = 'v1') {
  return `${environment.API_URL}/api/${version}/${endpoint}`;
}

export function getImageUrl(image: string) { return `${image}` }
