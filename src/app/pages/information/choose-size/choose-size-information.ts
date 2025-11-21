import {Component, signal} from "@angular/core";
import {RouterLink} from "@angular/router";
import {TuiItem} from "@taiga-ui/cdk";
import {TuiLink} from "@taiga-ui/core";
import {TuiBreadcrumbs} from "@taiga-ui/kit";
import {NgOptimizedImage} from "@angular/common";

@Component({
  templateUrl: 'choose-size-information.html',
  selector: 'choose-size-information',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    TuiBreadcrumbs,
    TuiItem,
    TuiLink,
    RouterLink,
    NgOptimizedImage
  ]
})
export default class ChooseSizeInformation {
  selectedSize = signal({
    name: '35 EU',
    sizes: {
      eu: '35',
      us: 'M3.5/W5',
      mm: '215',
      uk: '2.5',
      ru: '34'
    }
  });
  readonly sizes = [
    {
      name: '35 EU',
      sizes: {
        eu: '35',
        us: 'M3.5/W5',
        mm: '215',
        uk: '2.5',
        ru: '34'
      }
    },
    {
      name: '36 EU',
      sizes: {
        eu: '36',
        us: 'M4/W5.5',
        mm: '220',
        uk: '3',
        ru: '35'
      }
    },
    {
      name: '36.5 EU',
      sizes: {
        eu: '36.5',
        us: 'M4.5/W6',
        mm: '225',
        uk: '3.5',
        ru: '35.5'
      }
    },
    {
      name: '37 EU',
      sizes: {
        eu: '37',
        us: 'M5/W6.5',
        mm: '230',
        uk: '4',
        ru: '36'
      }
    },
    {
      name: '38 EU',
      sizes: {
        eu: '38',
        us: 'M5.5/W7',
        mm: '235',
        uk: '4.5',
        ru: '37'
      }
    },
    {
      name: '38.5 EU',
      sizes: {
        eu: '38.5',
        us: 'M6/W7.5',
        mm: '240',
        uk: '5',
        ru: '37.5'
      }
    },
    {
      name: '39 EU',
      sizes: {
        eu: '39',
        us: 'M6.5/W8',
        mm: '245',
        uk: '5.5',
        ru: '38'
      }
    },
    {
      name: '40 EU',
      sizes: {
        eu: '40',
        us: 'M7/W8.5',
        mm: '250',
        uk: '6',
        ru: '39'
      }
    },
    {
      name: '40.5 EU',
      sizes: {
        eu: '40.5',
        us: 'M7.5/W9',
        mm: '255',
        uk: '6.5',
        ru: '39.5'
      }
    },
    {
      name: '41 EU',
      sizes: {
        eu: '41',
        us: 'M8/W9.5',
        mm: '260',
        uk: '7',
        ru: '40'
      }
    },
    {
      name: '42 EU',
      sizes: {
        eu: '42',
        us: 'M8.5/W10',
        mm: '265',
        uk: '7.5',
        ru: '41'
      }
    },
    {
      name: '42.5 EU',
      sizes: {
        eu: '42.5',
        us: 'M9/W10.5',
        mm: '270',
        uk: '8',
        ru: '41.5'
      }
    },
    {
      name: '43 EU',
      sizes: {
        eu: '43',
        us: 'M9.5/W11',
        mm: '275',
        uk: '8.5',
        ru: '42'
      }
    },
    {
      name: '44 EU',
      sizes: {
        eu: '44',
        us: 'M10/W11.5',
        mm: '280',
        uk: '9',
        ru: '43'
      }
    },
    {
      name: '44.5 EU',
      sizes: {
        eu: '44.5',
        us: 'M10.5/W12',
        mm: '285',
        uk: '9.5',
        ru: '43.5'
      }
    },
    {
      name: '45 EU',
      sizes: {
        eu: '45',
        us: 'M11/W12.5',
        mm: '290',
        uk: '10',
        ru: '44'
      }
    },
    {
      name: '46 EU',
      sizes: {
        eu: '46',
        us: 'M11.5/W13',
        mm: '295',
        uk: '10.5',
        ru: '45'
      }
    },
    {
      name: '46.5 EU',
      sizes: {
        eu: '46.5',
        us: 'M12/W13.5',
        mm: '300',
        uk: '11',
        ru: '45.5'
      }
    },
    {
      name: '47 EU',
      sizes: {
        eu: '47',
        us: 'M12.5/W14',
        mm: '305',
        uk: '11.5',
        ru: '46'
      }
    },
    {
      name: '48 EU',
      sizes: {
        eu: '48',
        us: 'M13/W14.5',
        mm: '310',
        uk: '12',
        ru: '47'
      }
    },
    {
      name: '48.5 EU',
      sizes: {
        eu: '48.5',
        us: 'M13.5/W15',
        mm: '315',
        uk: '12.5',
        ru: '47.5'
      }
    },
    {
      name: '49 EU',
      sizes: {
        eu: '49',
        us: 'M14/W15.5',
        mm: '320',
        uk: '13',
        ru: '48'
      }
    },
  ];
}
