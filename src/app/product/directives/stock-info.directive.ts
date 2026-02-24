import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStockInfo]',
  standalone: false,
})
export class StockInfoDirective implements AfterViewInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
  ) {}

  @Input('appStockInfo') amount!: number;

  ngAfterViewInit() {
    let text;
    let className;

    if (this.amount >= 10) {
      text = 'In Stock';
      className = 'success';
    } else if (this.amount > 0) {
      text = 'Almost Sold Out';
      className = 'warning';
    } else if (this.amount == 0) {
      text = 'Out Of Stock';
      className = 'danger';
    }

    if (text && className) {
      const textElem = this.renderer.createElement('div');
      this.renderer.addClass(textElem, `color-${className}`);
      this.renderer.addClass(textElem, 'font-size-sm');
      this.renderer.appendChild(textElem, this.renderer.createText(text));

      this.renderer.appendChild(this.el.nativeElement, textElem);
    }
  }
}
