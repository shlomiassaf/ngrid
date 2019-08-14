import { Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, Output, ViewChild, ElementRef } from '@angular/core';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-search-input',
  templateUrl: './app-search-input.component.html',
  styleUrls: [ './app-search-input.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSearchInput {
  query: string = '';

  private searchDebounce = 300;
  private searchSubject = new Subject<string>();

  @ViewChild('input', { static: true, read: ElementRef }) input: ElementRef;
  @ViewChild('formField', { static: true, read: ElementRef }) formField: ElementRef;

  @Output() onSearch = this.searchSubject.pipe(distinctUntilChanged(), debounceTime(this.searchDebounce));

  constructor(private locationService: LocationService) { }

  /**
   * When we first show this search box we trigger a search if there is a search query in the URL
   */
  ngOnInit() {
    const query = this.locationService.search()['search'];
    if (query) {
      this.doSearch(query);
    }
  }

  onFocus(): void {
    if (this.query) {
      this.searchSubject.next(this.query);
    }
  }

  doSearch(query: string) {
    this.query = query;
    this.searchSubject.next(query);
  }

  focus(): void {
    this.input.nativeElement.focus();
  }

  clear() {
    this.input.nativeElement.value = '';
    this.input.nativeElement.blur();
    this.formField.nativeElement.classList.remove('mat-focused' );
    this.doSearch('');
  }
}
