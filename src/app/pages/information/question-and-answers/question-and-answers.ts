import { Component, signal } from "@angular/core";
import { TuiBreadcrumbs } from "@taiga-ui/kit";
import { TuiItem } from "@taiga-ui/cdk";
import { TuiLink } from "@taiga-ui/core";
import { RouterLink } from "@angular/router";
import { IconComponent } from "@/components/icon/icon";

@Component({
    templateUrl: 'question-and-answers.html',
    selector: 'question-and-answers',
    host: { class: 'flex w-full justify-center pb-10' },
    imports: [
        TuiBreadcrumbs,
        TuiItem,
        TuiLink,
        RouterLink,
        IconComponent
    ]
})
export default class QuestionAndAnswers {
    activeIndex = signal<number | null>(null);

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

    setIndex(index: number) {
        this.activeIndex.update(current => current === index ? null : index);
    }
}