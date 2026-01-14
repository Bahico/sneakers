import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReferralsService} from '@/services/referrals.service';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {IconComponent} from '@/components/icon/icon';

@Component({
  selector: 'referral-create',
  imports: [
    IconComponent,
    ReactiveFormsModule
  ],
  templateUrl: 'referral-create.html'
})
export class ReferralCreate {
  protected readonly context = injectContext<TuiDialogContext<void, void>>();
  private readonly referralService = inject(ReferralsService);

  form = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    code: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  })

  onSubmit() {
    this.referralService.generateLink(this.rowValue)
      .subscribe(() => {
        this.close()
      })
  }

  get rowValue() {
    return this.form.getRawValue();
  }

  close() {
    this.context.$implicit.next();
    this.context.$implicit.complete();
  }
}
