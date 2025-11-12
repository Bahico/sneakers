import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { TuiItem } from "@taiga-ui/cdk";
import { TuiLink } from "@taiga-ui/core";
import { TuiBreadcrumbs } from "@taiga-ui/kit";
import { NgOptimizedImage } from "@angular/common";

@Component({
    templateUrl: 'choose-size-information.html',
    selector: 'choose-size-information',
    host: { class: 'flex w-full justify-center pb-10' },
    imports: [
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    RouterLink,
    NgOptimizedImage
]
})
export default class ChooseSizeInformation {
    readonly sizes = [
        "35 ⅓ EU",
        "35 ⅔ EU",
        "36 EU",
        "36 ⅔ EU",
        "37 ⅓ EU",
        "38 EU",
        "38 ⅔ EU",
        "39 ⅓ EU",
        "40 EU",
        "40 ⅔ EU",
        "40 ⅓ EU",
        "42 EU",
        "42 ⅔ EU",
        "43 ⅓ EU",
        "44 EU",
        "44 ⅔ EU",
        "45 ⅓ EU",
        "46 EU",
        "46 ⅔ EU",
        "47 ⅓ EU",
        "48 EU",
        "48 ⅔ EU",
        "49 ⅓ EU",
        "50 EU"
    ]
}