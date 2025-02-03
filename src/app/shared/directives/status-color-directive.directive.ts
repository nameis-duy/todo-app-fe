import { Directive, ElementRef, inject, Input, input, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appStatusColorDirective]'
})
export class StatusColorDirectiveDirective {
  el = inject(ElementRef);
  render = inject(Renderer2);

  @Input() status = 'Pending';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['status']) {
      this.updateColor();
    }
  }

  updateColor() : void {
    let colorCode = '#0225FF';
    if (this.status === 'Completed') {
      colorCode = '#05A301';
    }

    if (this.el.nativeElement.tagName === 'DIV') {
      this.render.setStyle(this.el.nativeElement, 'borderColor', colorCode);
    }
    else {
      this.render.setStyle(this.el.nativeElement, 'color', colorCode);
    }
  }
}
