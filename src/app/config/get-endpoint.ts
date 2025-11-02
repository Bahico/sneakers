import {API_URL} from 'environments';

export function getEndpoint(endpoint: string) {
  return `${API_URL}/api/v1/${endpoint}`
}

export function getImageUrl(image: string) { return `${image}` }
