import { Directive, ElementRef, inject, Input, Renderer2, SimpleChanges } from '@angular/core';

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
    let colorCode = '#F21E1E';
    let borderColorCode = '#A1A3AB'
    if (this.status === 'Completed') {
      colorCode = '#05A301';
      borderColorCode = '#05A301';
    } else if (this.status === 'InProgress') {
      colorCode = '#0225FF';
      borderColorCode = '#0225FF';
    }

    if (this.el.nativeElement.tagName === 'DIV') {
      this.render.setStyle(this.el.nativeElement, 'borderColor', borderColorCode);
    }
    else {
      this.render.setStyle(this.el.nativeElement, 'color', colorCode);
    }
  }
}
