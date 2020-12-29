import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'bsHeaderTitle'})
export class PblNgridBsHeaderTitlePipe implements PipeTransform {
  transform(value: string): string {
    return value[0].toUpperCase() + value.slice(1);
  }
}
