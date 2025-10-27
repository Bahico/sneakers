import {Component, model} from '@angular/core';
import {TuiTabs} from '@taiga-ui/kit';
import {NgClass} from '@angular/common';

@Component({
  templateUrl: 'product-detail-size.component.html',
  imports: [
    TuiTabs,
    NgClass
  ],
  selector: 'product-detail-size'
})
export class ProductDetailSizeComponent {
  protected activeItemIndex = model(0);

  productSize = [
    35, '35 ⅓', '36 ⅓', '36', '37',
    35, '35 ⅓', '36 ⅓', '36', '37',
    35, '35 ⅓', '36 ⅓', '36', '37'
  ];
  active = model(null);
}
