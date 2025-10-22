import {API_URL} from '../../environment/environment';

export function getEndpoint(endpoint: string) {
  return `${API_URL}/${endpoint}`
}
