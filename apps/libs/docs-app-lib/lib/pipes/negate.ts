import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name:"negate"
})
export class PblNegatePipe implements PipeTransform {
  transform(value: string): boolean {
    return !value;
  }
}
