import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelToSpace'
})
export class StringCamelToSpacePipe implements PipeTransform {

  transform(text: string): string {
    if (!text) return '';
    return text.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
}
