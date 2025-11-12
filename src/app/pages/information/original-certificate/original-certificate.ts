import { Component } from "@angular/core";
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {RouterLink} from '@angular/router';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {NgOptimizedImage} from '@angular/common';

@Component({
  templateUrl: 'original-certificate.html',
  host: { class: 'flex w-full justify-center pb-10' },
  imports: [
    TuiBreadcrumbs,
    RouterLink,
    TuiLink,
    TuiItem,
    NgOptimizedImage
  ],
  selector: 'original-certificate'
})
export default class OriginalCertificate {

}
