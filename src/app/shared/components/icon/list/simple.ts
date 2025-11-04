import {IconList} from '@/components/icon/icon.model';

export default [
  {
    name: 'plus',
    icon: `
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.4395 11.4141V25.4628" stroke="#222222" stroke-width="1.36585" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11.415 18.4395H25.4638" stroke="#222222" stroke-width="1.36585" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
  },
  {
    name: 'minus',
    icon: `
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.415 18.4395H25.4638" stroke="#222222" stroke-width="1.36585" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
  },
  {
    name: 'right-arrow-outline',
    icon: `
      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.1 5.96867C11.5 6.19961 11.5 6.77696 11.1 7.0079L0.9 12.8969C0.499999 13.1278 0 12.8391 0 12.3773V0.599308C0 0.137427 0.5 -0.151247 0.9 0.0796934L11.1 5.96867Z" fill="#E8E8E8"/>
      </svg>
    `
  }
] satisfies IconList[];
