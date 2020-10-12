import { ChangeDetectionStrategy, Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { createDS, columnFactory } from '@pebula/ngrid';
import { Example } from '@pebula/apps/shared';
import { Person, DemoDataSource } from '@pebula/apps/shared-data';

@Component({
  selector: 'pbl-grid-height-grid-example',
  templateUrl: './grid-height.component.html',
  styleUrls: ['./grid-height.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@Example('pbl-grid-height-grid-example', { title: 'Grid Height Example' })
export class GridHeightGridExample {

  columns = columnFactory()
    .default({ minWidth: 40 })
    .table(
      { prop: 'id', width: '40px' },
      { prop: 'name' },
      { prop: 'gender', width: '50px' },
      { prop: 'email', width: '150px' },
      { prop: 'country' },
      { prop: 'language' },
    )
    .header(
      { id: 'header1', label: 'Header 1', width: '25%'},
      { id: 'header2', label: 'Header 2'},
    )
    .headerGroup(
      { prop: 'name', span: 1, label: 'Name & Gender' },
    )
    .header(
      { id: 'header3', label: 'Header 3'},
    )
    .headerGroup(
      { prop: 'id', span: 2, label: 'ID, Name & Gender' },
      { prop: 'country', span: 1, label: 'Country & Language' },
    )
    .footer(
      { id: 'footer1', label: 'Footer 1', width: '25%'},
      { id: 'footer2', label: 'Footer 2'},
    )
    .footer(
      { id: 'footer3', label: 'Footer 3'},
    )
    .build();

  ds = createDS<Person>()
    .keepAlive()
    .onTrigger( () => this.datasource.getPeople(0, 500) )
    .create();

  explicitGridHeight = true;
  fallbackMinHeight = true;
  vScroll = true;

  settings: {
    explicitGridHeight: boolean;
    fallbackMinHeight: number;
    vScroll: boolean;
  }

  constructor(private datasource: DemoDataSource, private cdr: ChangeDetectorRef) {
    this.createSettings();
  }

  ngOnDestroy(): void {
    this.ds.dispose();
  }
  redraw(): void {
    this.settings = undefined;
    setTimeout(() => {
      this.createSettings();
      this.cdr.detectChanges();
    }, 50);
  }

  private createSettings(): void {
    this.settings = {
      explicitGridHeight: this.explicitGridHeight,
      fallbackMinHeight: this.fallbackMinHeight ? 150 : 0,
      vScroll: this.vScroll,
    }
  }
}
