import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TuiItem } from "@taiga-ui/cdk";
import { TuiLink } from "@taiga-ui/core";
import { TuiBreadcrumbs } from "@taiga-ui/kit";

@Component({
    templateUrl: 'personal-data.html',
    selector: 'personal-data',
    host: { class: 'flex w-full justify-center pb-10' },
    imports: [
        TuiBreadcrumbs,
        TuiItem,
        TuiLink,
        RouterLink,
    ]
})
export default class PersonalData {

}