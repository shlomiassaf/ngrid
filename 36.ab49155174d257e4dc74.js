(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{WPM6:function(t,e,n){"use strict";n.d(e,"a",function(){return s});var r=n("XiUz"),a=n("znSr"),i=n("YT2F"),o=n("fXoL");let s=(()=>{class t{}return t.\u0275mod=o.Sb({type:t}),t.\u0275inj=o.Rb({factory:function(e){return new(e||t)},imports:[[r.e,a.b,i.l],r.e,a.b,i.l]}),t})()},lzXN:function(t,e,n){"use strict";n.r(e),n.d(e,"EnablingCustomTriggersExampleModule",function(){return f});var r=n("mrSG"),a=n("ofXK"),i=n("XEBs"),o=n("ewPf"),s=n("YT2F"),c=n("WPM6"),p=n("fluT"),g=n("fXoL"),u=n("XkVd"),l=n("mxEP"),b=n("ibH8");function d(t,e){if(1&t&&g.Vb(0,"pbl-ngrid-paginator",2),2&t){const t=e.$implicit;g.wc("grid",t)("paginator",t.ds.paginator)}}let m=(()=>{let t=class{constructor(t){this.datasource=t,this.columns={table:{cols:[{prop:"id"},{prop:"name"},{prop:"email"}]}},this.dsCustomTrigger=Object(i.s)().setCustomTriggers("pagination","sort").onTrigger(t=>!(!t.pagination.changed&&!t.isInitial)&&(t.updateTotalLength(500),this.datasource.getPeople(0,500).then(e=>{const n=t.pagination.page.curr,r=t.pagination.perPage.curr;return e.slice((n-1)*r,(n-1)*r+r)}))).create()}};return t.\u0275fac=function(e){return new(e||t)(g.Ub(p.a))},t.\u0275cmp=g.Ob({type:t,selectors:[["pbl-enabling-custom-triggers-example-component"]],decls:2,vars:2,consts:[["usePagination","",3,"dataSource","columns"],[3,"grid","paginator",4,"pblNgridPaginatorRef"],[3,"grid","paginator"]],template:function(t,e){1&t&&(g.ac(0,"pbl-ngrid",0),g.Qc(1,d,1,2,"pbl-ngrid-paginator",1),g.Zb()),2&t&&g.wc("dataSource",e.dsCustomTrigger)("columns",e.columns)},directives:[u.a,l.a,b.a],styles:[""],encapsulation:2,changeDetection:0}),t=Object(r.a)([Object(s.e)("pbl-enabling-custom-triggers-example-component",{title:"Enabling custom triggers"}),Object(r.b)("design:paramtypes",[p.a])],t),t})(),f=(()=>{let t=class{};return t.\u0275mod=g.Sb({type:t}),t.\u0275inj=g.Rb({factory:function(e){return new(e||t)},imports:[[a.c,c.a,i.j,o.a]]}),t=Object(r.a)([Object(s.a)(m)],t),t})()}}]);