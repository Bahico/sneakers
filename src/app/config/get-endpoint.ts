import {API_URL} from '../../environment/environment';

export function getEndpoint(endpoint: string) {
  return `${API_URL}/${endpoint}`
}

export function getImageUrl(image: string) { return `${image}` }
