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
  },
  {
    name: 'trash-outline',
    icon: `
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.75 0.5H11.25C11.7141 0.5 12.1591 0.684507 12.4873 1.0127C12.8155 1.34088 13 1.78587 13 2.25V3.5H17.25C17.3163 3.5 17.3799 3.52636 17.4268 3.57324C17.4736 3.62013 17.5 3.6837 17.5 3.75C17.5 3.8163 17.4736 3.87987 17.4268 3.92676C17.3799 3.97364 17.3163 4 17.25 4H16V18C16 18.2652 15.8946 18.5195 15.707 18.707C15.5195 18.8946 15.2652 19 15 19H3C2.73478 19 2.4805 18.8946 2.29297 18.707C2.10543 18.5195 2 18.2652 2 18V4H0.75C0.683697 4 0.620127 3.97364 0.573242 3.92676C0.526358 3.87987 0.5 3.8163 0.5 3.75L0.504883 3.70117C0.514468 3.65306 0.53804 3.60844 0.573242 3.57324C0.620127 3.52636 0.683696 3.5 0.75 3.5H5V2.25C5 1.78587 5.18451 1.34088 5.5127 1.0127C5.84088 0.684507 6.28587 0.5 6.75 0.5ZM6.75 1C6.41848 1 6.10063 1.13179 5.86621 1.36621C5.63179 1.60063 5.5 1.91848 5.5 2.25V3.5H12.5V2.25C12.5 1.91848 12.3682 1.60063 12.1338 1.36621C11.8994 1.13179 11.5815 1 11.25 1H6.75Z" stroke="#222222"/>
      </svg>
    `
  },
] satisfies IconList[];
