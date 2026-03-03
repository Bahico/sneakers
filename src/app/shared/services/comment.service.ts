import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint} from '@/get-endpoint';
import {Comment, CommentListResult, CreateCommentDto} from '@/models/comment';
import {ListResult} from '@/models/list-result';
import {Observable} from 'rxjs';



@Injectable({providedIn: 'root'})
export class CommentService {
  private readonly http = inject(HttpClient);

  private readonly endpoint = getEndpoint('reviews/');

  /**
   * Get comments/reviews for a specific product
   * @param product_id - The product ID
   * @param params - Query parameters for pagination
   * @returns Observable of paginated comments
   */
  getComments(product_id: string, params: {limit: number; offset: number}): Observable<CommentListResult> {
    return this.http.get<CommentListResult>(`${this.endpoint}${product_id}`, {params});
  }

  /**
   * Get comments/reviews for a specific brand
   * @param params - Query parameters for pagination and brand IDs
   * @param params - Query parameters for pagination
   * @returns Observable of paginated comments
   */
  getCommentsByBrand(params: {limit: number; offset: number; brand_ids: string[]}): Observable<CommentListResult> {
    return this.http.get<CommentListResult>(getEndpoint('reviews/by-brands/list'), {params});
  }

  /**
   * Get a single comment/review by ID
   * @param id - The comment ID
   * @returns Observable of the comment
   */
  getComment(id: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.endpoint}${id}`);
  }

  /**
   * Create a new comment/review
   * @param data - Comment data
   * @returns Observable of the created comment
   */
  createComment(data: CreateCommentDto): Observable<Comment> {
    const images = new FormData();
    for (const image of data.images || []) {
      images.append('files', image);
    }
    return this.http.post<Comment>(`${this.endpoint}${data.product_id}/create`, images, {params: {rating: data.rating, text: data.text}});
  }

  /**
   * Delete a comment/review
   * @param id - The comment ID
   * @returns Observable of void
   */
  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}${id}`);
  }
}
