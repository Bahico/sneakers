import { BlogService } from '@/services/blog.service';
import { DatePipe } from '@angular/common';
import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiLink } from '@taiga-ui/core';
import { TuiBreadcrumbs } from '@taiga-ui/kit';
import { tap } from 'rxjs';

@Component({
  templateUrl: 'blog-detail.html',
  styleUrl: 'blog-detail.css',
  selector: 'blog-detail',
  host: {class: 'flex w-full justify-center'},
  encapsulation: ViewEncapsulation.ShadowDom,
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    DatePipe
  ]
})
export default class BlogDetailPage {
  private readonly blogService = inject(BlogService);

  slug = input.required<string>();

  protected readonly blogResource = rxResource({
    params: () => this.slug(),
    stream: ({params}) => this.blogService.detail(params).pipe(tap(res => console.log(res))),
    defaultValue: null
  });
}
