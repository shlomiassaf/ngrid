import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NegTableModule } from '@neg/table';
import { NegTableDragModule } from '@neg/table/drag';
import { SharedModule } from '@neg/apps/table/shared';
import { TableMixDemoModule, GeneralDemoTableExampleComponent, AllInOneTableExampleComponent } from './modules/mix-demo';

import { DemoContainerPageComponent } from './demo-container-page/demo-container-page.component';
import { AppHomePageComponent } from './app-home-page/app-home-page.component';

const ROUTES: Routes = [
  { path: '', pathMatch: 'fullMatch', component: DemoContainerPageComponent, children: [
    { path: '', pathMatch: 'fullMatch', component: AppHomePageComponent },
    { path: 'demos', children:
      [
        { path: 'all-in-one', component: AllInOneTableExampleComponent, data: { title: 'All In One' } },
        { path: 'virtual-scroll-performance', component: GeneralDemoTableExampleComponent, data: { title: 'Demo' } },
      ]
    },
  ]},
];

@NgModule({
  declarations: [ DemoContainerPageComponent, AppHomePageComponent ],
  imports: [
    RouterModule.forChild(ROUTES),
    NegTableModule.forRoot({
      virtualScroll: {
        wheelMode: 17,
      },
    }, []),
    NegTableDragModule,
    TableMixDemoModule,
    SharedModule,
  ],
})
export class DemosModule { }
