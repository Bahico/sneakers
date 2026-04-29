import { Component, inject } from '@angular/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiDialogContext, TuiFormatNumberPipe } from '@taiga-ui/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { IconComponent } from '@/components/icon/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { getEndpoint } from '@/get-endpoint';

@Component({
  templateUrl: 'gift-order.html',
  selector: 'gift-order',
  imports: [
    TuiFormatNumberPipe,
    AsyncPipe,
    IconComponent,
    NgOptimizedImage,
    ReactiveFormsModule
  ]
})
export class GiftOrder {
  protected readonly context = injectContext<TuiDialogContext<string, number>>();
  private readonly http = inject(HttpClient);

  form = new FormGroup({
    fio: new FormControl('', [Validators.required]),
    telegram_nickname: new FormControl('', [Validators.required]),
    telegram_username: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.form.invalid) return;

    const body = {
      ...this.form.getRawValue(),
      amount: this.context.data,
    };

    this.http.post(getEndpoint('orders/payment/certifacte'), body)
      .subscribe(() => {
        this.close();
      });
  }

  close() {
    this.context.$implicit.complete()
  }
}
