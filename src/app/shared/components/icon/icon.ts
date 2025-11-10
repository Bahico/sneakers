import {Component, inject, input, OnChanges, OnInit} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ICON_LIST} from "./icon-list";

@Component({
  standalone: true,
  template: `
    <span [innerHTML]="iconHtml"></span>
  `,
  selector: 'icon-list'
})
export class IconComponent implements OnInit, OnChanges {
  private readonly sanitizer = inject(DomSanitizer);

  icon = input.required<string>();
  iconHtml: SafeHtml;

  ngOnInit() {
    this.iconHtml = this.sanitizeHtml(this.iconElement);
  }

  ngOnChanges() {
    this.iconHtml = this.sanitizeHtml(this.iconElement);
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  get iconElement() {
    return ICON_LIST.find(item => item.name === this.icon()).icon;
  }
}
