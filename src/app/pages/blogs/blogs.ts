import {Component, inject, SecurityContext} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiLink} from '@taiga-ui/core';
import {TuiItem} from '@taiga-ui/cdk';
import {BlogService} from '@/services/blog.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: 'blogs.html',
  selector: 'blogs',
  host: {class: 'flex w-full justify-center'},
  imports: [
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    RouterLink,
    DatePipe
  ]
})
export default class Blogs {
  private readonly blogService = inject(BlogService);
  private readonly sanitizer = inject(DomSanitizer);

  sanitizeHtml(html: string) {
    return this.sanitizer.sanitize(SecurityContext.HTML, html);
  }

  protected readonly blogsResource = rxResource({
    params: () => ({page: 1, size: 24}),
    stream: ({params}) => this.blogService.query(params),
    defaultValue: {items: [], total: 0, pages: 0, size: 0}
  })
}
