import {computed, inject, Injectable, signal} from '@angular/core';
import {ProductListDetailModel, ProductModel, Variant} from '@/models/product.model';
import {AuthenticationOpen} from '@/components/authentication/authentication-open';
import {AccountStore} from '@/account';
import {CartService} from '@/services/cart.service';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {MobileAddCart} from '@/product/detail/components/mobile-add-cart/mobile-add-cart';
import {concatMap} from 'rxjs';
import {CartStore} from '@/cart';
import {BuyCoin} from '@/product/detail/components/buy-coin/buy-coin';

@Injectable({providedIn: 'root'})
export class ProductDetailStore {
  private readonly accountStore = inject(AccountStore);
  private readonly authenticationService = inject(AuthenticationOpen);
  private readonly cartService = inject(CartService);
  private readonly dialogs = inject(TuiDialogService);
  private readonly cartStore = inject(CartStore, {optional: true});

  private readonly productDetail$ = signal<Partial<ProductModel>>({});
  private readonly productSimilar$ = signal<ProductListDetailModel[]>([]);

  protected readonly isAuthed = computed(() => !!this.accountStore.account());

  readonly sizeType = signal<string>(null);
  readonly sizeValue = signal<string>(null);

  readonly selectedSkus = computed<Variant>(() =>
    this.productDetail$().variants?.find(item => item.size[this.sizeType()?.toLowerCase()] === this.sizeValue())
  );

  readonly cart = computed(() => this.cartStore.carts()?.items?.find(item => item.variant.id === this.selectedSkus()?.id))

  get detail() {
    return this.productDetail$.asReadonly();
  }

  set update(value: ProductModel) {
    this.productDetail$.set(value);
  }

  get similar() {
    return this.productSimilar$.asReadonly();
  }

  set updateSimilar(value: ProductListDetailModel[]) {
    this.productSimilar$.set(value);
  }

  addToCart(): void {
    if (!this.isAuthed() && !this.cartService.getCartId()) {
      this.dialogs
        .open(
          new PolymorpheusComponent(BuyCoin),
          {
            label: null,
            size: 'l'
          },
        )
        .subscribe();
      return
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
