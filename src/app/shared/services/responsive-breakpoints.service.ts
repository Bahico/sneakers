import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformServer } from '@angular/common';

export const BREAKPOINTS = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  xxl: '(min-width: 1536px)',
};

export enum BREAKPOINTS_ENUM {
  BASE = 'base',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

@Injectable({ providedIn: 'root' })
export class ResponsiveBreakpointsService {
  private readonly bp = inject(BreakpointObserver);
  private readonly platformId = inject(PLATFORM_ID);

  private matches = toSignal(this.bp.observe(Object.values(BREAKPOINTS)));

  current = computed(() => {
    const result = this.matches()?.breakpoints;

    if (isPlatformServer(this.platformId)) {
      return BREAKPOINTS_ENUM.MD;
    }

    if (!result) return BREAKPOINTS_ENUM.BASE;
    if (result[BREAKPOINTS.xxl]) return BREAKPOINTS_ENUM.XXL;
    if (result[BREAKPOINTS.xl]) return BREAKPOINTS_ENUM.XL;
    if (result[BREAKPOINTS.lg]) return BREAKPOINTS_ENUM.LG;
    if (result[BREAKPOINTS.md]) return BREAKPOINTS_ENUM.MD;
    if (result[BREAKPOINTS.sm]) return BREAKPOINTS_ENUM.SM;
    return BREAKPOINTS_ENUM.BASE;
  });

  isBase = computed(() => this.current() === BREAKPOINTS_ENUM.BASE);
  isSm = computed(() => this.current() === BREAKPOINTS_ENUM.SM);
  isMd = computed(() => this.current() === BREAKPOINTS_ENUM.MD);
  isLg = computed(() => this.current() === BREAKPOINTS_ENUM.LG);
  isXl = computed(() => this.current() === BREAKPOINTS_ENUM.XL);
  is2xl = computed(() => this.current() === BREAKPOINTS_ENUM.XXL);

  isMobile = computed(() => this.isSm() || this.isBase());
}
