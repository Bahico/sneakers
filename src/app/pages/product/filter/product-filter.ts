import {Component, signal} from '@angular/core';
import {TuiBreadcrumbs, TuiRange} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {RouterLink} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {IconComponent} from '@/components/icon/icon';

@Component({
  selector: 'product-filter',
  templateUrl: 'product-filter.html',
  host: {class: 'flex w-full justify-center'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    TuiRange,
    ReactiveFormsModule,
    IconComponent
  ]
})
export default class ProductFilter {
  protected readonly formControl = new FormControl([4, 6]);

  protected readonly openFilters = signal({
    size: false,
  });

  protected items = signal([
    {
      caption: 'Главная',
      routerLink: '/',
    },
    {
      caption: 'Мужское'
    },
    {
      caption: 'Обувь'
    },
  ]);

  changeOpen(key: string) {
    this.openFilters.update(filters => ({
        ...filters,
        [key]: !filters[key]
      })
    );
    console.log(this.openFilters())
  }
}
