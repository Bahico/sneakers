import { Component } from "@angular/core";
import { TuiBreadcrumbs } from "@taiga-ui/kit";
import { TuiItem } from "@taiga-ui/cdk";
import { TuiLink } from "@taiga-ui/core";
import { RouterLink } from "@angular/router";
import { NgOptimizedImage } from "@angular/common";

@Component({
    templateUrl: 'payment-and-rules.html',
    selector: 'payment-and-rules',
    host: { class: 'flex w-full justify-center pb-10' },
    imports: [
        TuiBreadcrumbs,
        TuiItem,
        TuiLink,
        RouterLink,
        NgOptimizedImage,
    ]
})
export default class PaymentAndRules {

}