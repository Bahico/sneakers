import {Component, inject, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {TuiCheckbox} from '@taiga-ui/kit';
import {CommentService} from '@/services/comment.service';
import {ProductDetailStore} from '@/product/detail/services/product-detail-store';
import {CreateCommentDto} from '@/models/comment';
import {catchError, finalize, of} from 'rxjs';

@Component({
  templateUrl: 'feedback.html',
  selector: 'feedback',
  imports: [
    IconComponent,
    ReactiveFormsModule,
    TuiCheckbox,
    FormsModule
  ]
})
export class Feedback {
  private readonly commentService = inject(CommentService);
  private readonly productDetailStore = inject(ProductDetailStore);
  protected readonly context = injectContext<TuiDialogContext<string, string>>();
  
  protected readonly form = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    comment: new FormControl(null, [Validators.required]),
    star: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
  });

  images = signal<string[]>([]);
  imageFiles = signal<File[]>([]);
  success = signal(false);
  agree = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  close() {
    this.context.$implicit.complete();
  }

  setStar(star: number) {
    this.form.patchValue({star});
    this.form.controls.star.markAsTouched();
  }

  onFileChange(event: Event) {
    const files = [...(event.target as HTMLInputElement).files || []];
    const newFiles = files.slice(0, 3 - this.imageFiles().length);
    
    this.imageFiles.update(current => [...current, ...newFiles].slice(0, 3));
    this.images.update(current => [
      ...current,
      ...newFiles.map(file => URL.createObjectURL(file))
    ].slice(0, 3));
  }

  removeImage(index: number) {
    const url = this.images()[index];
    if (url) {
      URL.revokeObjectURL(url);
    }
    this.images.update(images => images.filter((_, i) => i !== index));
    this.imageFiles.update(files => files.filter((_, i) => i !== index));
  }

  async onSubmit() {
    if (this.form.invalid || !this.agree() || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const productId = this.productDetailStore.detail().id;
    if (!productId) {
      this.error.set('Ошибка: не найден продукт');
      this.loading.set(false);
      return;
    }

    try {

      this.commentService.createComment({
        product_id: productId,
        rating: this.form.value.star,
        text: this.form.value.comment,
        images: this.imageFiles()
      })
        .pipe(
          catchError(error => {
            this.error.set(error?.error?.message || 'Ошибка при отправке отзыва');
            return of(null);
          }),
          finalize(() => this.loading.set(false))
        )
        .subscribe(response => {
          if (response) {
            this.success.set(true);
            // Clean up object URLs
            this.images().forEach(url => URL.revokeObjectURL(url));
          }
        });
    } catch (error) {
      this.error.set('Ошибка при обработке изображений');
      this.loading.set(false);
    }
  }
}
