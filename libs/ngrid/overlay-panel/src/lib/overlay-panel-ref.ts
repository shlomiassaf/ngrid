import { merge, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OverlayRef } from '@angular/cdk/overlay';

export class PblNgridOverlayPanelRef<T = any> {

  closed: Observable<void>;
  private _closed$ = new Subject<void>();

  constructor(private overlayRef: OverlayRef, public readonly data?: T) {
    this.closed = this._closed$.asObservable();
    this._closingActions(this, overlayRef)
      .pipe(
        takeUntil(this.closed),
      )
      .subscribe(() => this.close());
  }

  close(): void {
    if (this._closed$) {
      const closed$ = this._closed$;
      this._closed$ = undefined;
      closed$.next();
      closed$.complete();
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }

  private _closingActions(overlayPanelRef: PblNgridOverlayPanelRef, overlayRef: OverlayRef) {
    const backdrop = overlayRef!.backdropClick();
    const detachments = overlayRef!.detachments();

    return merge(backdrop, detachments, overlayPanelRef.closed);
  }
}
