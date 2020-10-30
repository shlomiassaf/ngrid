import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ViewLayoutObserver {

  isMobile$: Observable<boolean>;
  isWeb$: Observable<boolean>;
  constructor(public readonly breakpointObserver: BreakpointObserver) {
    this.isWeb$ = breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(
        map( result => result.matches )
      );
    this.isMobile$ = this.isWeb$.pipe(map( value => !value ));
  }
}
