(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{Y9SF:function(e,t,i){"use strict";i.r(t),i.d(t,"ColumnResizeExampleModule",function(){return z});var s=i("mrSG"),c=i("ofXK"),r=i("XEBs"),a=i("LnE1"),n=i("YT2F"),l=i("WPM6"),o=i("fluT"),p=i("fXoL"),d=i("XkVd");let u=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=Object(r.r)().table({prop:"id",width:"40px"},{prop:"name",resize:!0},{prop:"gender",resize:!0,width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=Object(r.s)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};return e.\u0275fac=function(t){return new(t||e)(p.Ub(o.a))},e.\u0275cmp=p.Ob({type:e,selectors:[["pbl-column-resize-example"]],decls:1,vars:2,consts:[[1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",3,"dataSource","columns"]],template:function(e,t){1&e&&p.Vb(0,"pbl-ngrid",0),2&e&&p.wc("dataSource",t.ds)("columns",t.columns)},directives:[d.a],styles:[""],encapsulation:2,changeDetection:0}),e=Object(s.a)([Object(n.e)("pbl-column-resize-example",{title:"Simple Resizing"}),Object(s.b)("design:paramtypes",[o.a])],e),e})(),b=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=Object(r.r)().table({prop:"id",width:"40px"},{prop:"name",width:"15%"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",maxWidth:120}).build(),this.ds=Object(r.s)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}resize(){const e=this.ds.hostGrid.columnApi.findColumn("id");this.ds.hostGrid.columnApi.resizeColumn(e,"200px")}};return e.\u0275fac=function(t){return new(t||e)(p.Ub(o.a))},e.\u0275cmp=p.Ob({type:e,selectors:[["pbl-resizing-with-the-api-example"]],decls:6,vars:2,consts:[[3,"click"],[1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",3,"dataSource","columns"],["pblTable1",""]],template:function(e,t){if(1&e){const e=p.bc();p.ac(0,"button",0),p.lc("click",function(){return t.resize()}),p.Sc(1,"Resize id to 200px"),p.Zb(),p.ac(2,"button",0),p.lc("click",function(){return p.Hc(e),p.Ec(5).autoSizeColumnToFit()}),p.Sc(3,"Fit Content"),p.Zb(),p.Vb(4,"pbl-ngrid",1,2)}2&e&&(p.Hb(4),p.wc("dataSource",t.ds)("columns",t.columns))},directives:[d.a],styles:[""],encapsulation:2,changeDetection:0}),e=Object(s.a)([Object(n.e)("pbl-resizing-with-the-api-example",{title:"Resizing With The Api"}),Object(s.b)("design:paramtypes",[o.a])],e),e})(),m=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=Object(r.r)().table({prop:"id",width:"40px"},{prop:"name",resize:!0,minWidth:100,maxWidth:300},{prop:"gender",resize:!0,minWidth:50},{prop:"birthdate",type:"date"}).build(),this.ds=Object(r.s)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};return e.\u0275fac=function(t){return new(t||e)(p.Ub(o.a))},e.\u0275cmp=p.Ob({type:e,selectors:[["pbl-resize-boundaries-example"]],decls:1,vars:2,consts:[[3,"dataSource","columns"]],template:function(e,t){1&e&&p.Vb(0,"pbl-ngrid",0),2&e&&p.wc("dataSource",t.ds)("columns",t.columns)},directives:[d.a],styles:[""],encapsulation:2,changeDetection:0}),e=Object(s.a)([Object(n.e)("pbl-resize-boundaries-example",{title:"Resize Boundaries"}),Object(s.b)("design:paramtypes",[o.a])],e),e})();var h=i("Dw4w"),g=i("m6/o");function w(e,t){1&e&&(p.ac(0,"pbl-ngrid-drag-resize",2),p.Vb(1,"span",3),p.Zb()),2&e&&p.wc("context",t.$implicit)("grabAreaWidth",8)}let f=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=Object(r.r)().default({resize:!0}).table({prop:"id",wontBudge:!0,width:"40px"},{prop:"name"},{prop:"gender",width:"50px"},{prop:"email",width:"150px"},{prop:"country"},{prop:"language"},{prop:"birthdate",type:"date"},{prop:"balance"}).headerGroup({label:"Group A",columnIds:["name","gender"]},{label:"Group B",columnIds:["country","language"]}).build(),this.ds=Object(r.s)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};return e.\u0275fac=function(t){return new(t||e)(p.Ub(o.a))},e.\u0275cmp=p.Ob({type:e,selectors:[["pbl-custom-resizing-example"]],decls:2,vars:2,consts:[[3,"dataSource","columns"],[3,"context","grabAreaWidth",4,"pblNgridCellResizerRef"],[3,"context","grabAreaWidth"],[1,"pbl-ngrid-column-resizer-handle"]],template:function(e,t){1&e&&(p.ac(0,"pbl-ngrid",0),p.Qc(1,w,2,2,"pbl-ngrid-drag-resize",1),p.Zb()),2&e&&p.wc("dataSource",t.ds)("columns",t.columns)},directives:[d.a,h.a,g.b],styles:[""],encapsulation:2,changeDetection:0}),e=Object(s.a)([Object(n.e)("pbl-custom-resizing-example",{title:"Custom Resizing"}),Object(s.b)("design:paramtypes",[o.a])],e),e})(),z=(()=>{let e=class{};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=p.Sb({type:e}),e.\u0275inj=p.Rb({imports:[[c.c,l.a,r.j,a.a.withDefaultTemplates()]]}),e=Object(s.a)([Object(n.a)(u,b,m,f)],e),e})()}}]);