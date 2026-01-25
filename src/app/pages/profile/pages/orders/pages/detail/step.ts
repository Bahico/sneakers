import {Component, inject, input, model} from '@angular/core';
import {NgClass} from '@angular/common';
import {SvgIconComponent} from '@ngneat/svg-icon';
import {ResponsiveBreakpointsService} from '@/services/responsive-breakpoints.service';

export type StepState = 'done' | 'active' | 'pending';

export interface StepItem {
  label: string;
  icon?: string; // masalan: '✓', '📦' yoki icon class
}

@Component({
  selector: 'steps',
  templateUrl: 'steps.html',
  styleUrl: 'steps.scss',
  imports: [
    NgClass,
    SvgIconComponent,
  ]
})
export class StepsComponent {
  protected readonly rbs = inject(ResponsiveBreakpointsService);

  steps = input.required<StepItem[]>();
  activeIndex = model(0); // 0-based

  getState(index: number): StepState {
    if (index < this.activeIndex()) return 'done';
    if (index === this.activeIndex()) return 'active';
    return 'pending';
  }

  // line active bo'lishi: oldingi step "done" bo'lsa
  isLineActive(index: number): boolean {
    // index -> step index, line step va step+1 orasida
    return index < this.activeIndex();
  }
}
