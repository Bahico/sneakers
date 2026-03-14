import {inject, Injectable} from '@angular/core';
import {getEndpoint} from '@/get-endpoint';
import {HttpClient} from '@angular/common/http';
import {Blog} from '@/models/blog';
import { delay } from 'rxjs';

@Injectable({providedIn: 'root'})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = getEndpoint('blog');

  query(params: {q?: string; page: number; size: number;}) {
    return this.http.get<{items: Blog[]; total: number; pages: number; size: number}>(this.endpoint + '/', {params: params});
  }

  detail(slug: string) {
    return this.http.get<Blog>(`${this.endpoint}/${slug}/`);
  }
}
