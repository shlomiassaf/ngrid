import { first } from 'rxjs/operators';
import {
  AfterContentInit,
  AfterViewInit,
  Directive,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngOnInit], [ngAfterContentInit], [ngAfterViewInit], [ngOnDestroy], [ngAfterViewInitAsync]',
  // tslint:disable-next-line:use-output-property-decorator
  outputs: [ 'onInit:ngOnInit', 'afterContentInit:ngAfterContentInit', 'afterViewInit:ngAfterViewInit', 'onDestroy:ngOnDestroy', 'afterViewInitAsync:ngAfterViewInitAsync' ],
  exportAs: 'ngHooks'
})
export class NgEventsDirective implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {
  onInit = new EventEmitter<void>();
  afterContentInit = new EventEmitter<void>();
  afterViewInit = new EventEmitter<void>();
  onDestroy = new EventEmitter<void>();

  afterViewInitAsync = new EventEmitter<void>();

  constructor(private zone: NgZone) { }

  ngOnInit(): void { this.onInit.emit(); }

  ngAfterContentInit() { this.afterContentInit.emit(); }

  ngAfterViewInit() {
    this.afterViewInit.emit();
    this.zone.onStable.pipe(first()).subscribe(() => this.afterViewInitAsync.emit());
  }

  ngOnDestroy(): void { this.onDestroy.emit(); }
}
