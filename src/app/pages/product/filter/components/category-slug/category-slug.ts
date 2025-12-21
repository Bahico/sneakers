import {afterNextRender, Component, inject} from '@angular/core';
import {ActivatedRoute, UrlSegment} from '@angular/router';

@Component({
  templateUrl: 'category-slug.html',
  selector: 'category-slug',
})
export default class CategorySlug {
  private readonly route = inject(ActivatedRoute);

  fullPath: string[] = [];

  constructor() {
    afterNextRender(() =>{
      console.log('aaaa')
      this.loadCategory()
    })
  }

  loadCategory() {
    console.log(this.route.url)
    this.route.url.subscribe((segments: UrlSegment[]) => {
      this.fullPath = segments.map(s => s.path);
      console.log(this.fullPath);
    });
  }
}
