import {afterNextRender, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CategoryShoes} from '@/home/components/category/shoes/category-shoes';
import {ProductService} from '@/services/product.service';
import {CategoryCloth} from '@/home/components/category/cloth/category-cloth';
import {CategoryAccessories} from '@/home/components/category/accessories/category-accessories';
import {Banner} from "./components/banner/banner";
import {NgOptimizedImage} from '@angular/common';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {PoizonProductCalculate} from '@/home/components/poizon-product-calculate/poizon-product-calculate';

@Component({
  templateUrl: 'home.html',
  selector: 'home',
  host: {class: 'flex w-full justify-center'},
  imports: [RouterLink, RouterLinkActive, CategoryShoes, CategoryCloth, CategoryAccessories, Banner, NgOptimizedImage],
})
export default class Home {
  private readonly productService = inject(ProductService);
  private readonly dialogs = inject(TuiDialogService);


  constructor() {
    afterNextRender(() => {
      this.productService.query({}).subscribe()
    })
  }

  openCalculate() {
    this.dialogs.open(
      new PolymorpheusComponent(PoizonProductCalculate),
      {
        label: null,
        size: 'm'
      },
    ).subscribe()
  }
}
