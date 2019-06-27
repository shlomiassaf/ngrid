import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { SharedModule } from '@pebula/apps/ngrid/shared';
import { TableMixDemoModule, GeneralDemoGridExampleComponent, AllInOneGridExampleComponent } from './modules/mix-demo';

import { DemoContainerPageComponent } from './demo-container-page/demo-container-page.component';
import { AppHomePageComponent } from './app-home-page/app-home-page.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'fullMatch', component: DemoContainerPageComponent, children: [
    { path: '', pathMatch: 'fullMatch', component: AppHomePageComponent },
    { path: 'demos', children:
      [
        { path: 'all-in-one', component: AllInOneGridExampleComponent, data: { title: 'All In One' } },
        { path: 'virtual-scroll-performance', component: GeneralDemoGridExampleComponent, data: { title: 'Demo' } },
      ]
    },
  ]},
];

@NgModule({
  declarations: [ DemoContainerPageComponent, AppHomePageComponent ],
  imports: [
    RouterModule.forChild(ROUTES),
    PblNgridModule.forRoot({
      virtualScroll: {
        wheelMode: 17,
      },
    }, []),
    PblNgridDragModule,
    TableMixDemoModule,
    SharedModule,
  ],
})
export class DemosModule { }
