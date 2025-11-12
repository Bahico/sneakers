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
        "В каких случаях возможен возврат?",
        "Можно ли вернуть товар, если он не подошел по размеру?",
        "Какие условия возврата?",
        "Можно ли изменить размер или цвет после оформления заказа?",
        "Какой размер выбрать?",
        "Какой порядок доставки?",
        "Почему цена зависит от размера?",
        "Обувь оригинальная?"
    ];

    setIndex(index: number) {
        this.activeIndex.update(current => current === index ? null : index);
    }
}