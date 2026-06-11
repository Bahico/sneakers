import {Component, computed, input} from '@angular/core';
import {ProductModel} from '@/models/product.model';

@Component({
  templateUrl: 'contacts-product.html',
  selector: 'contacts-product',
})
export class ContactsProduct {
  product = input<Partial<ProductModel>>();
}
