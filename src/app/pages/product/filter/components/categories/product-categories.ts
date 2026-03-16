import { ProductService } from "@/services/product.service";
import { CategoryListDetailModel } from "@/models/category";
import { Component, inject, input } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { of } from "rxjs";
import { RouterLink } from "@angular/router";

@Component({
    templateUrl: 'product-categories.html',
    selector: 'product-categories',
    imports: [
        RouterLink,
    ],
})
export class ProductCategories {
    private readonly productService = inject(ProductService);

    parent_slug = input.required<string>();

    readonly categories = rxResource<CategoryListDetailModel[], string>({
        params: () => this.parent_slug(),
        stream: ({ params }) => params ? this.productService.categories({ parent_slug: params }) : of([]),
        defaultValue: [],
    });
}