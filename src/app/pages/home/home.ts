import {afterNextRender, Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CategoryShoes} from '@/home/components/category/shoes/category-shoes';
import {ProductService} from '@/services/product.service';
import {CategoryCloth} from '@/home/components/category/cloth/category-cloth';
import {CategoryAccessories} from '@/home/components/category/accessories/category-accessories';
import { Banner } from "./components/banner/banner";

@Component({
  templateUrl: 'home.html',
  selector: 'home',
  host: {class: 'flex w-full justify-center'},
  imports: [RouterLink, RouterLinkActive, CategoryShoes, CategoryCloth, CategoryAccessories, Banner],
})
export default class Home {
  private readonly productService = inject(ProductService);

  constructor() {
    afterNextRender(() => {
      this.productService.query({}).subscribe()
    })
  }
}
