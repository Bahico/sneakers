import {environment} from 'environments';

export function getEndpoint(endpoint: string) {
  return `${environment.API_URL}/api/v1/${endpoint}`;
}

export function getImageUrl(image: string) { return `${image}` }
