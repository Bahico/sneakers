import {Component, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {TuiDropdown, TuiLink} from '@taiga-ui/core';
import {TuiActiveZone, TuiItem, TuiObscured} from '@taiga-ui/cdk';
import {NgOptimizedImage} from '@angular/common';
import {IconComponent} from '@/components/icon/icon';

@Component({
  templateUrl: 'gift-certificate.html',
  selector: 'gift-certificate',
  host: {class: 'flex w-full justify-center pb-10'},
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    NgOptimizedImage,
    TuiDropdown,
    TuiObscured,
    TuiActiveZone,
    IconComponent
  ]
})
export default class GiftCertificate {
  activeIndex = signal<number | null>(null);
  protected open = false;

  steps = [
    { title: 'Выбираете номинал', description: 'Доступны номиналы 5\'000₽, 10\'000₽, 15\'000₽, 20\'000₽, 30\'000₽, 50\'000₽, 100\'000₽', side: 'left' },
    { title: 'Покупаете сертификат', description: 'Оплата производится банковской картой. У нас полностью белый официальный онлайн-эквайринг', side: 'right' },
    { title: 'Получаете сертификат', description: 'В течении 10 минут после оплаты мы пришлем вам электронный сертификат в формате PDF на указанный вами Telegram-аккаунт', side: 'left' },
    { title: 'Дарите сертификат как подарок', description: 'Просто пересылаете PDF своему другу, подруге, родственнику и коллеге вместе со своим поздравлением', side: 'right' },
    { title: 'Получатель может использовать сертификат', description: 'Получатель увидит инструкции по активации внутри PDF документа. Также у него будет ссылка на каталог товаров Sneaker Team. Для активации ему нужно будет отправить этот сертификат в наш официальный чат заботы о клиентах. Мы начислим сумму номинала на баланс средств в личном кабинете Sneaker Team.', side: 'left' },
  ];

  questions = [
    "Что такое электронный сертификат?",
    "Как купить электронный сертификат?",
    "Что такое Telegram Sneaker Team? Где его найти?",
    "Как подарить сертификат?",
    "На что можно потратить сертификат?",
    "Сколько действует сертификат?",
    "Как активировать подарочный сертификат?",
    "Как оплатить заказ электронным сертификатом?"
  ];

  protected onClick(): void {
    this.open = !this.open;
  }

  protected onObscured(obscured: boolean): void {
    if (obscured) {
      this.open = false;
    }
  }

  protected onActiveZone(active: boolean): void {
    this.open = active && this.open;
  }

  setIndex(index: number) {
    this.activeIndex.update(current => current === index ? null : index);
  }
}
