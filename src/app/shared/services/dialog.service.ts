import {inject, Injectable} from '@angular/core';
import {ResponsiveBreakpointsService} from '@/services/responsive-breakpoints.service';
import type {PolymorpheusContent} from '@taiga-ui/polymorpheus';
import {TuiSheetDialogService} from '@taiga-ui/addon-mobile';
import {TuiPopoverContext} from '@taiga-ui/cdk';
import {TuiDialogOptions, TuiDialogService} from '@taiga-ui/core';

@Injectable({providedIn: 'root'})
export class DialogService<T, K = void> {
  private readonly rbs = inject(ResponsiveBreakpointsService);
  private readonly sheetDialogService = inject(TuiSheetDialogService);
  private readonly dialogService = inject(TuiDialogService);

  private readonly isMobile = this.rbs.isMobile;

  open<G = void>(content: PolymorpheusContent<T & TuiPopoverContext<K extends void ? G : K>>, options?: Partial<TuiDialogOptions<any>>) {
    if (this.isMobile())
      return this.sheetDialogService.open(content, options);

    return this.dialogService.open(content, options);
  }
}
