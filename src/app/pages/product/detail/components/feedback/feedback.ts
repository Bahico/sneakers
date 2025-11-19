import {Component, signal} from '@angular/core';
import {IconComponent} from '@/components/icon/icon';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';

@Component({
  templateUrl: 'feedback.html',
  selector: 'feedback',
  imports: [
    IconComponent,
    ReactiveFormsModule
  ]
})
export class Feedback {
  protected readonly context = injectContext<TuiDialogContext<string, string>>();
  protected readonly form = new FormGroup({
    name: new FormControl(null , [Validators.required]),
    email: new FormControl(null , [Validators.email]),
    comment: new FormControl(null , [Validators.required]),
    star: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
  });

  images = signal<string[]>([])

  close() {
    this.context.$implicit.complete();
  }

  setStar(star: number) {
    this.form.patchValue({star});
  }

  onFileChange(event: Event) {
    const files = [...(event.target as HTMLInputElement).files]
    this.images.update(images => [
      ...images,
      ...files.map(file => URL.createObjectURL(file))
    ].splice(0, 3))
  }

  removeImage(index: number) {
    this.images.update(images => images.filter((_, i) => i !== index))
  }
}
