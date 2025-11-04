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
  }
] satisfies IconList[];
