import {Component} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';

@Component({
  selector: 'original-certificate',
  templateUrl: 'original-certificate.html',
  imports: [
    IconComponent
  ],
  host: {class: 'flex flex-col items-center'}
})
export class OriginalCertificate {}
