import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {NgClass} from '@angular/common';

export type StepStatus = 'done' | 'active' | 'pending';

export interface StepItem {
  title: string;
  date?: string;
  status: StepStatus;
}

@Component({
  selector: 'steps-timeline',
  templateUrl: './steps-timeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass
  ]
})
export class StepsTimeline {
  @Input() steps: StepItem[] = [];

  dotClass(step: StepItem) {
    if (step.status === 'active') return 'bg-black';
    if (step.status === 'done') return 'bg-black';
    return 'bg-gray-300';
  }

  lineClass(step: StepItem) {
    if (step.status === 'done') return 'bg-black';
    return 'bg-gray-200';
  }

  textClass(step: StepItem) {
    if (step.status === 'active') return 'text-black font-semibold';
    if (step.status === 'done') return 'text-gray-800';
    return 'text-gray-500';
  }
}
