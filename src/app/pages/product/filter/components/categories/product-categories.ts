import { isPlatformBrowser } from "@angular/common";
import { ProductService } from "@/services/product.service";
import { CategoryListDetailModel } from "@/models/category";
import {
    Component,
    effect,
    ElementRef,
    inject,
    input,
    PLATFORM_ID,
    signal,
    untracked,
    viewChild,
} from "@angular/core";
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
    private readonly platformId = inject(PLATFORM_ID);

    readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');
    readonly scrollContent = viewChild<ElementRef<HTMLDivElement>>('scrollContent');

    readonly canScrollPrev = signal(false);
    readonly canScrollNext = signal(false);

    parent_category = input.required<string>();
    gender = input.required<string>();

    readonly categories = rxResource<CategoryListDetailModel[], string>({
        params: () => this.parent_category(),
        stream: ({ params }) => params ? this.productService.categories({ parent_category_name_search: params }) : of([]),
        defaultValue: [],
    });

    constructor() {
        effect((onCleanup) => {
            const list = this.categories.value();
            const containerRef = this.scrollContainer();
            const contentRef = this.scrollContent();

            if (!list?.length || !containerRef || !contentRef) {
                untracked(() => {
                    this.canScrollPrev.set(false);
                    this.canScrollNext.set(false);
                });
                return;
            }

            untracked(() => {
                if (!isPlatformBrowser(this.platformId)) {
                    return;
                }
                const viewport = containerRef.nativeElement;
                const content = contentRef.nativeElement;
                const ro = new ResizeObserver(() => this.updateScrollState());
                ro.observe(viewport);
                ro.observe(content);
                onCleanup(() => ro.disconnect());

                requestAnimationFrame(() => this.updateScrollState());
            });
        });
    }

    updateScrollState(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const el = this.scrollContainer()?.nativeElement;
        if (!el) {
            this.canScrollPrev.set(false);
            this.canScrollNext.set(false);
            return;
        }
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const epsilon = 2;
        const hasOverflow = scrollWidth > clientWidth + epsilon;
        if (!hasOverflow) {
            this.canScrollPrev.set(false);
            this.canScrollNext.set(false);
            return;
        }
        this.canScrollPrev.set(scrollLeft > epsilon);
        this.canScrollNext.set(scrollLeft + clientWidth < scrollWidth - epsilon);
    }

    previous(): void {
        const container = this.scrollContainer()?.nativeElement;
        if (container) {
            container.scrollBy({ left: -300, behavior: 'smooth' });
        }
    }

    next(): void {
        const container = this.scrollContainer()?.nativeElement;
        if (container) {
            container.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }
}
