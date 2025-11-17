
import { Component } from "@angular/core";
import { TuiBreadcrumbs } from "@taiga-ui/kit";
import { TuiLink } from "@taiga-ui/core";
import { TuiItem } from "@taiga-ui/cdk";
import { RouterLink } from "@angular/router";

@Component({
  templateUrl: 'user-agreement.html',
  selector: 'user-agreement',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink
  ]
})
export default class UserAgreement {

}