!function(){function t(t){return function(t){if(Array.isArray(t))return i(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||n(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],i=!0,r=!1,o=void 0;try{for(var a,c=t[Symbol.iterator]();!(i=(a=c.next()).done)&&(n.push(a.value),!e||n.length!==e);i=!0);}catch(s){r=!0,o=s}finally{try{i||null==c.return||c.return()}finally{if(r)throw o}}return n}(t,e)||n(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(t,e){if(t){if("string"==typeof t)return i(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(t,e):void 0}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function r(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{WPM6:function(t,e,n){"use strict";n.d(e,"a",function(){return s});var i=n("XiUz"),r=n("znSr"),a=n("YT2F"),c=n("fXoL"),s=function(){var t=function t(){o(this,t)};return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=c.Sb({type:t}),t.\u0275inj=c.Rb({imports:[[i.e,r.b,a.l],i.e,r.b,a.l]}),t}()},lKyu:function(n,i,a){"use strict";a.r(i),a.d(i,"InfiniteScrollExampleModule",function(){return A});var c=a("mrSG"),s=a("ofXK"),l=a("XEBs"),p=a("4dOD"),u=a("bv9b"),d=a("LpJu"),b=a("YT2F"),f=a("WPM6"),m=a("fluT"),g=a("fXoL"),h=a("XkVd");function w(t,e){1&t&&g.Vb(0,"mat-progress-bar",2)}var y,v=((y=function(){function t(e){var n=this;o(this,t),this.datasource=e,this.loading=!1,this.columns=Object(l.r)().table({prop:"id",width:"100px"},{prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=Object(l.s)().onTrigger(function(t){return n.allPeople?(n.loading=!1,Promise.resolve(n.allPeople.slice(0,Math.min(n.allPeople.length,n.ds.source.length+50)))):n.datasource.getPeople(100,1e3).then(function(t){return n.allPeople=t,n.allPeople.slice(0,Math.min(n.allPeople.length,(n.ds.source||[]).length+50))})}).create()}var e,n,i;return e=t,(n=[{key:"ngAfterViewInit",value:function(){var t=this;this.ds.onRenderedDataChanged.subscribe(function(){t.ds.length-t.ds.renderStart<20&&(t.loading||(t.loading=!0,setTimeout(function(){return t.ds.refresh()},1e3*Math.random())))})}}])&&r(e.prototype,n),i&&r(e,i),t}()).\u0275fac=function(t){return new(t||y)(g.Ub(m.a))},y.\u0275cmp=g.Ob({type:y,selectors:[["pbl-infinite-scroll-example"]],decls:2,vars:3,consts:[[3,"dataSource","columns"],["mode","indeterminate",4,"ngIf"],["mode","indeterminate"]],template:function(t,e){1&t&&(g.ac(0,"pbl-ngrid",0),g.Qc(1,w,1,0,"mat-progress-bar",1),g.Zb()),2&t&&(g.wc("dataSource",e.ds)("columns",e.columns),g.Hb(1),g.wc("ngIf",e.loading))},directives:[h.a,s.p,u.a],styles:[""],encapsulation:2,changeDetection:0}),y=Object(c.a)([Object(b.e)("pbl-infinite-scroll-example",{title:"Infinite Scroll"}),Object(c.b)("design:paramtypes",[m.a])],y)),S=a("HDdC");function O(t,e){1&t&&g.Vb(0,"mat-progress-bar",2)}var I,j=((I=function n(i){var r=this;o(this,n),this.client=i,this.columns=Object(l.r)().table({prop:"id",width:"100px",pIndex:!0},{prop:"name",width:"100px",editable:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=Object(d.b)().withInfiniteScrollOptions({blockSize:100,initialVirtualSize:100}).withCacheOptions("sequenceBlocks").onTrigger(function(n){if(n.isInitial)return r.ds.setCacheSize(800),r.client.getPeople({pagination:{itemsPerPage:100,page:1}}).then(function(t){return r.ds.updateVirtualSize(t.pagination.totalItems),n.updateTotalLength(t.pagination.totalItems),t.items});console.log(n.fromRow,n.toRow);var i=n.fromRow%100,o=Math.floor(n.fromRow/100)+1,a=[r.client.getPeople({pagination:{itemsPerPage:100,page:o}})];return i>0&&a.push(r.client.getPeople({pagination:{itemsPerPage:100,page:o+1}})),new S.a(function(r){return console.log("NEW CALL WITH ".concat(n.fromRow," - ").concat(n.toRow)),Promise.all(a).then(function(n){var o=e(n,2),a=o[0],c=o[1],s=a.items.slice(i,100);c&&s.push.apply(s,t(c.items.slice(0,i))),r.next(s),r.complete()}).catch(function(t){return r.error(t)}),function(){return console.log("DONE WITH ".concat(n.fromRow," - ").concat(n.toRow))}})}).create()}).\u0275fac=function(t){return new(t||I)(g.Ub(m.b))},I.\u0275cmp=g.Ob({type:I,selectors:[["pbl-infinite-scroll-data-source-example"]],decls:3,vars:5,consts:[[3,"dataSource","columns"],["mode","indeterminate",4,"ngIf"],["mode","indeterminate"]],template:function(t,e){1&t&&(g.ac(0,"pbl-ngrid",0),g.Qc(1,O,1,0,"mat-progress-bar",1),g.qc(2,"async"),g.Zb()),2&t&&(g.wc("dataSource",e.ds)("columns",e.columns),g.Hb(1),g.wc("ngIf",g.rc(2,3,e.ds.adapter.virtualRowsLoading)))},directives:[h.a,s.p,u.a],pipes:[s.b],styles:[""],encapsulation:2,changeDetection:0}),I=Object(c.a)([Object(b.e)("pbl-infinite-scroll-data-source-example",{title:"Infinite Scroll Data Source"}),Object(c.b)("design:paramtypes",[m.b])],I)),P=a("PIXP"),x=a("ejGh");function R(t,e){1&t&&g.Vb(0,"mat-progress-bar",3)}function T(t,e){1&t&&g.Vb(0,"pbl-ngrid-row",4)}var k,V,z,C=((z=function t(e){var n=this;o(this,t),this.client=e,this.columns=Object(l.r)().table({prop:"id",width:"100px",pIndex:!0},{prop:"name",width:"100px",editable:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=Object(d.b)().withInfiniteScrollOptions({blockSize:100,initialVirtualSize:100}).withCacheOptions("fragmentedBlocks",{strictPaging:!1}).onTrigger(function(t){return t.isInitial?(n.ds.setCacheSize(800),n.client.getPeople({pagination:{skip:0,limit:100}}).then(function(e){return n.ds.updateVirtualSize(e.pagination.totalItems),t.updateTotalLength(e.pagination.totalItems),e.items})):(console.log(t.fromRow,t.toRow),n.client.getPeople({pagination:{skip:t.fromRow,limit:t.toRow-t.fromRow+1}}).then(function(t){return t.items}))}).create()}).\u0275fac=function(t){return new(t||z)(g.Ub(m.b))},z.\u0275cmp=g.Ob({type:z,selectors:[["pbl-index-based-paging-example"]],decls:4,vars:5,consts:[[3,"dataSource","columns"],["mode","indeterminate",4,"ngIf"],["in","","class","pbl-ngrid-infinite-virtual-row","row","",4,"pblNgridInfiniteVirtualRowDef"],["mode","indeterminate"],["in","","row","",1,"pbl-ngrid-infinite-virtual-row"]],template:function(t,e){1&t&&(g.ac(0,"pbl-ngrid",0),g.Qc(1,R,1,0,"mat-progress-bar",1),g.qc(2,"async"),g.Qc(3,T,1,0,"pbl-ngrid-row",2),g.Zb()),2&t&&(g.wc("dataSource",e.ds)("columns",e.columns),g.Hb(1),g.wc("ngIf",g.rc(2,3,e.ds.adapter.virtualRowsLoading)))},directives:[h.a,s.p,P.a,u.a,x.a],pipes:[s.b],styles:[""],encapsulation:2,changeDetection:0}),z=Object(c.a)([Object(b.e)("pbl-index-based-paging-example",{title:"Index Based Paging"}),Object(c.b)("design:paramtypes",[m.b])],z)),E=((V=function t(e){var n=this;o(this,t),this.client=e,this.columns=Object(l.r)().table({prop:"id",width:"100px",pIndex:!0},{prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=Object(d.b)().withInfiniteScrollOptions({blockSize:100,initialVirtualSize:100}).withCacheOptions("fragmentedBlocks",{strictPaging:!1}).setCustomTriggers("filter","sort").onTrigger(function(t){if(t.isInitial)return n.ds.setCacheSize(800),n.client.getPeople({pagination:{skip:0,limit:100}}).then(function(e){return n.ds.updateVirtualSize(e.pagination.totalItems),t.updateTotalLength(e.pagination.totalItems),e.items});switch(t.eventSource){case"infiniteScroll":return n.client.getPeople({pagination:{skip:t.fromRow,limit:t.toRow-t.fromRow+1}}).then(function(t){return t.items});case"customTrigger":break;default:throw new Error("This should NEVER EVENT happen...")}}).create()}).\u0275fac=function(t){return new(t||V)(g.Ub(m.b))},V.\u0275cmp=g.Ob({type:V,selectors:[["pbl-custom-triggers-example"]],decls:1,vars:2,consts:[[3,"dataSource","columns"]],template:function(t,e){1&t&&g.Vb(0,"pbl-ngrid",0),2&t&&g.wc("dataSource",e.ds)("columns",e.columns)},directives:[h.a],styles:[""],encapsulation:2,changeDetection:0}),V=Object(c.a)([Object(b.e)("pbl-custom-triggers-example",{title:"Custom Triggers"}),Object(c.b)("design:paramtypes",[m.b])],V)),A=((k=function t(){o(this,t)}).\u0275fac=function(t){return new(t||k)},k.\u0275mod=g.Sb({type:k}),k.\u0275inj=g.Rb({imports:[[s.c,f.a,u.b,l.j,p.a,d.a]]}),k=Object(c.a)([Object(b.a)(v,j,C,E)],k))}}])}();