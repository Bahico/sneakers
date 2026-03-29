import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiBreadcrumbs, TuiRadioComponent } from '@taiga-ui/kit';
import { TuiDropdown, TuiFormatNumberPipe, TuiLink } from '@taiga-ui/core';
import { TuiActiveZone, TuiItem, TuiObscured } from '@taiga-ui/cdk';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { IconComponent } from '@/components/icon/icon';
import { FormsModule } from '@angular/forms';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { GiftOrder } from '@/information/gift-certificate/order/gift-order';
import { DialogService } from '@/services/dialog.service';

@Component({
  templateUrl: 'gift-certificate.html',
  selector: 'gift-certificate',
  host: { class: 'flex w-full justify-center pb-10' },
  styleUrl: 'gift-certificate.css',
  imports: [
    RouterLink,
    TuiBreadcrumbs,
    TuiLink,
    TuiItem,
    NgOptimizedImage,
    TuiDropdown,
    TuiObscured,
    TuiActiveZone,
    IconComponent,
    TuiFormatNumberPipe,
    AsyncPipe,
    TuiRadioComponent,
    FormsModule
  ]
})
export default class GiftCertificate {
  private readonly dialogs = inject(DialogService);

  protected readonly activeIndex = signal<number | null>(null);
  protected readonly amount = signal(15000);
  protected open = false;

  steps = [
    { title: 'Выбираете номинал', description: 'Доступны номиналы 5\'000₽, 10\'000₽, 15\'000₽, 20\'000₽, 30\'000₽, 50\'000₽, 100\'000₽', side: 'left' },
    { title: 'Покупаете сертификат', description: 'Оплата производится банковской картой. У нас полностью белый официальный онлайн-эквайринг', side: 'right' },
    { title: 'Получаете сертификат', description: 'В течении 10 минут после оплаты мы пришлем вам электронный сертификат в формате PDF на указанный вами Telegram-аккаунт', side: 'left' },
    { title: 'Дарите сертификат как подарок', description: 'Просто пересылаете PDF своему другу, подруге, родственнику и коллеге вместе со своим поздравлением', side: 'right' },
    { title: 'Получатель может использовать сертификат', description: 'Получатель увидит инструкции по активации внутри PDF документа. Также у него будет ссылка на каталог товаров Sneaker Team. Для активации ему нужно будет отправить этот сертификат в наш официальный чат заботы о клиентах. Мы начислим сумму номинала на баланс средств в личном кабинете Sneaker Team.', side: 'left' },
  ];

  questions = [
    {
      name: "Что такое электронный сертификат?",
      description: `Это персонализированный PDF-сертификат с уникальным номером, который отправляется вам в Telegram. В нём указаны имя и Telegram получателя — именно он сможет активировать сертификат. Вы самостоятельно передаёте его получателю. После активации на баланс пользователя зачисляется сумма, соответствующая номиналу сертификата.`
    },
    {
      name: "Как приобрести электронный сертификат?",
      description: "На этой странице нажмите кнопку «Купить сертификат». Укажите нужный номинал и заполните форму: впишите свой Telegram username, а также имя и username получателя, которому предназначен подарок. После оформления мы отправим электронный сертификат прямо в ваш Telegram."
    },
    {
      name: "Как дарить сертификат?",
      description: "Просто отправьте сертификат человеку вместе со словами поздравления. Внутри PDF получатель найдет информацию о нашем интернет-магазине и инструкции, как активировать сертификат."
    },
    {
      name: "На какие товары действует сертификат?",
      description: "Абсолютно на все позиции на сайте sneakerteam.ru"
    },
    {
      name: "У сертификата есть срок?",
      description: "Нет. Сертификат бессрочный, можно использовать в любое время"
    },
    {
      name: "Как активировать подарочный сертификат?",
      description: `Вышлите PDF сертификат в чат менеджеру <a href="https://t.me/sneakerteamhelp" target="_blank" class="text-primary underline">@sneakerteamhelp</a>, он поможет с активацией`
    },
    {
      name: "Как оплатить заказ электронным сертификатом?",
      description: "Сначала активируйте сертификат (как – написано выше). Номинал будет зачислен на баланс получателя в личный кабинет на сайте sneakerteam.ru"
    }
  ];

  protected readonly amounts = [
    5000,
    10000,
    15000,
    20000,
    30000,
    50000,
    100000,
  ]

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

  openModal() {
    this.dialogs
      .open(
        new PolymorpheusComponent(GiftOrder),
        {
          label: null,
          size: 'm',
          data: this.amount(),
          closeable: false,
        },
      )
      .subscribe();
  }
}
