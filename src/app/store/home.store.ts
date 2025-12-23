import {Injectable, signal} from '@angular/core';
import {Gender} from '@/models/gender';

@Injectable({providedIn: 'root'})
export class HomeStore {
  gender = signal<Gender>('male')
}
