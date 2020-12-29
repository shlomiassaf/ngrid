import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'headerToTitle'})
export class HeaderToTitlePipe implements PipeTransform {
  transform(value: string): string {
    return value[0].toUpperCase() + value.slice(1);
  }
}
