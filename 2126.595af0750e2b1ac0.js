"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[2126],{82126:(y,h,n)=>{n.r(h),n.d(h,{ColumnResizeExampleModule:()=>p});var l=n(70655),z=n(69808),a=n(14625),x=n(67513),u=n(88562),b=n(27569),o=n(50841),e=n(5e3),g=n(37048);let r=class{constructor(t){this.datasource=t,this.columns=(0,a.I7)().table({prop:"id",width:"40px"},{prop:"name",resize:!0},{prop:"gender",resize:!0,width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};r.\u0275fac=function(t){return new(t||r)(e.Y36(o.BQ))},r.\u0275cmp=e.Xpm({type:r,selectors:[["pbl-column-resize-example"]],decls:1,vars:2,consts:[[1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",3,"dataSource","columns"]],template:function(t,s){1&t&&e._UZ(0,"pbl-ngrid",0),2&t&&e.Q6J("dataSource",s.ds)("columns",s.columns)},dependencies:[g.eZ],encapsulation:2,changeDetection:0}),r=(0,l.gn)([(0,u.en)("pbl-column-resize-example",{title:"Simple Resizing"}),(0,l.w6)("design:paramtypes",[o.BQ])],r);let c=class{constructor(t){this.datasource=t,this.columns=(0,a.I7)().table({prop:"id",width:"40px"},{prop:"name",width:"15%"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",maxWidth:120}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}resize(){const t=this.ds.hostGrid.columnApi.findColumn("id");this.ds.hostGrid.columnApi.resizeColumn(t,"200px")}};c.\u0275fac=function(t){return new(t||c)(e.Y36(o.BQ))},c.\u0275cmp=e.Xpm({type:c,selectors:[["pbl-resizing-with-the-api-example"]],decls:6,vars:2,consts:[[3,"click"],[1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",3,"dataSource","columns"],["pblTable1",""]],template:function(t,s){if(1&t){const E=e.EpF();e.TgZ(0,"button",0),e.NdJ("click",function(){return s.resize()}),e._uU(1,"Resize id to 200px"),e.qZA(),e.TgZ(2,"button",0),e.NdJ("click",function(){e.CHM(E);const C=e.MAs(5);return e.KtG(C.autoSizeColumnToFit())}),e._uU(3,"Fit Content"),e.qZA(),e._UZ(4,"pbl-ngrid",1,2)}2&t&&(e.xp6(4),e.Q6J("dataSource",s.ds)("columns",s.columns))},dependencies:[g.eZ],encapsulation:2,changeDetection:0}),c=(0,l.gn)([(0,u.en)("pbl-resizing-with-the-api-example",{title:"Resizing With The Api"}),(0,l.w6)("design:paramtypes",[o.BQ])],c);let d=class{constructor(t){this.datasource=t,this.columns=(0,a.I7)().table({prop:"id",width:"40px"},{prop:"name",resize:!0,minWidth:100,maxWidth:300},{prop:"gender",resize:!0,minWidth:50},{prop:"birthdate",type:"date"}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};d.\u0275fac=function(t){return new(t||d)(e.Y36(o.BQ))},d.\u0275cmp=e.Xpm({type:d,selectors:[["pbl-resize-boundaries-example"]],decls:1,vars:2,consts:[[3,"dataSource","columns"]],template:function(t,s){1&t&&e._UZ(0,"pbl-ngrid",0),2&t&&e.Q6J("dataSource",s.ds)("columns",s.columns)},dependencies:[g.eZ],encapsulation:2,changeDetection:0}),d=(0,l.gn)([(0,u.en)("pbl-resize-boundaries-example",{title:"Resize Boundaries"}),(0,l.w6)("design:paramtypes",[o.BQ])],d);var R=n(80200),f=n(12358);function T(i,t){1&i&&(e.TgZ(0,"pbl-ngrid-drag-resize",2),e._UZ(1,"span",3),e.qZA()),2&i&&e.Q6J("context",t.$implicit)("grabAreaWidth",8)}let m=class{constructor(t){this.datasource=t,this.columns=(0,a.I7)().default({resize:!0}).table({prop:"id",wontBudge:!0,width:"40px"},{prop:"name"},{prop:"gender",width:"50px"},{prop:"email",width:"150px"},{prop:"country"},{prop:"language"},{prop:"birthdate",type:"date"},{prop:"balance"}).headerGroup({label:"Group A",columnIds:["name","gender"]},{label:"Group B",columnIds:["country","language"]}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};m.\u0275fac=function(t){return new(t||m)(e.Y36(o.BQ))},m.\u0275cmp=e.Xpm({type:m,selectors:[["pbl-custom-resizing-example"]],decls:2,vars:2,consts:[[3,"dataSource","columns"],[3,"context","grabAreaWidth",4,"pblNgridCellResizerRef"],[3,"context","grabAreaWidth"],[1,"pbl-ngrid-column-resizer-handle"]],template:function(t,s){1&t&&(e.TgZ(0,"pbl-ngrid",0),e.YNc(1,T,2,2,"pbl-ngrid-drag-resize",1),e.qZA()),2&t&&e.Q6J("dataSource",s.ds)("columns",s.columns)},dependencies:[g.eZ,R.S,f.q],encapsulation:2,changeDetection:0}),m=(0,l.gn)([(0,u.en)("pbl-custom-resizing-example",{title:"Custom Resizing"}),(0,l.w6)("design:paramtypes",[o.BQ])],m),n(63720);let p=class{};p.\u0275fac=function(t){return new(t||p)},p.\u0275mod=e.oAB({type:p}),p.\u0275inj=e.cJS({imports:[z.ez,b.a,a.dC,x.Ij.withDefaultTemplates()]}),p=(0,l.gn)([(0,u.qB)(r,c,d,m)],p)}}]);