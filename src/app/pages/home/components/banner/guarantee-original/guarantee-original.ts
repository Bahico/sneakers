import {Component} from "@angular/core";
import {RouterLink} from '@angular/router';
import {debounceTime, Subject} from 'rxjs';

@Component({
  templateUrl: 'guarantee-original.html',
  selector: 'guarantee-original',
  imports: [
    RouterLink
  ]
})
export class GuaranteeOriginal {}
