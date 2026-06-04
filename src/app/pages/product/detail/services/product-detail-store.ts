import {AccountStore} from '@/account';
import {CartStore} from '@/cart';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';
import {ProductListDetailModel, ProductModel, Variant} from '@/models/product.model';
import {MobileAddCart} from '@/product/detail/components/mobile-add-cart/mobile-add-cart';
import {CartService} from '@/services/cart.service';
import {computed, inject, Injectable, linkedSignal, signal} from '@angular/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {concatMap} from 'rxjs';
import {DialogService} from '@/services/dialog.service';

@Injectable({providedIn: 'root'})
export class ProductDetailStore {
  private readonly accountStore = inject(AccountStore);
  private readonly authenticationService = inject(AuthenticationOpen);
  private readonly cartService = inject(CartService);
  private readonly dialogs = inject(DialogService);
  private readonly cartStore = inject(CartStore, {optional: true});

  private readonly productDetail$ = signal<Partial<ProductModel>>({});
  private readonly productSimilar$ = signal<ProductListDetailModel[]>([]);

  protected readonly isAuthed = computed(() => !!this.accountStore.account());

  readonly sizeType = signal<string>(null);
  readonly sizeValue = signal<string>(null);

  readonly selectedSkus = linkedSignal<Variant>(() =>
    this.productDetail$().variants?.find(item => item.size[this.sizeType()?.toLowerCase()] === this.sizeValue())
  );

  readonly cart = computed(() => this.cartStore.carts()?.items?.find(item => item.variant.id === this.selectedSkus()?.id))

  get detail() {
    return this.productDetail$.asReadonly();
  }

  set update(value: ProductModel) {
    this.productDetail$.set(value);
    if (value.variants.length === 1) {
        this.selectedSkus.set(value.variants[0]);
    }
  }

  get similar() {
    return this.productSimilar$.asReadonly();
  }

  set updateSimilar(value: ProductListDetailModel[]) {
    this.productSimilar$.set(value);
  }

  addToCart(): void {
    if (!this.isAuthed()) {
      return this.authenticationService.openModal();
    }
    this.cartService.addCart({
      product_id: this.productDetail$().id,
      variant_id: this.selectedSkus().id,
      quantity: 1
    }).subscribe();
  }

  mobileAddCart() {
    if (!this.isAuthed()) {
      return this.authenticationService.openModal();
    }

    if (this.cart()) {
      this.openMobileModal().subscribe()
    } else {
      this.cartService.addCart({
        product_id: this.productDetail$().id,
        variant_id: this.selectedSkus().id,
        quantity: 1
      })
        .pipe(concatMap(() => this.openMobileModal()))
        .subscribe()
    }
  }

  openMobileModal() {
    return this.dialogs.open(
      new PolymorpheusComponent(MobileAddCart),
      {
        label: null,
        size: 'm'
      },
    )
  }

  clear() {
    this.productDetail$.set({});
    this.sizeType.set(null);
    this.sizeValue.set(null);
  }
}
