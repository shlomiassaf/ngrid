(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{"4DA5":function(t,e,c){"use strict";c.d(e,"a",function(){return l}),c.d(e,"b",function(){return b});var o=c("7+OI"),i=c("8LU1"),s=c("DcT9"),n=c("XEBs"),r=c("fXoL");const l="blockUi";let b=(()=>{class t{constructor(t,e){this.grid=t,this._blockInProgress=!1,this._removePlugin=e.setPlugin(l,this),t.registry.changes.subscribe(t=>{for(const e of t)switch(e.type){case"blocker":this.setupBlocker()}}),e.onInit().subscribe(t=>{t&&this._blockUi&&"boolean"==typeof this._blockUi&&this.setupBlocker()}),e.events.subscribe(t=>{if("onDataSource"===t.kind){const{prev:e,curr:c}=t;e&&s.r.kill(this,e),c.onSourceChanging.pipe(Object(s.r)(this,c)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!0,this.setupBlocker())}),c.onSourceChanged.pipe(Object(s.r)(this,c)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!1,this.setupBlocker())})}})}get blockUi(){return this._blockUi}set blockUi(t){let e=Object(i.c)(t);!e||"auto"!==t&&""!==t||(e="auto"),Object(o.a)(t)&&this._blockUi!==t?(Object(o.a)(this._blockUi)&&s.r.kill(this,this._blockUi),this._blockUi=t,t.pipe(Object(s.r)(this,this._blockUi)).subscribe(t=>{this._blockInProgress=t,this.setupBlocker()})):this._blockUi!==e&&(this._blockUi=e,"auto"!==e&&(this._blockInProgress=e,this.setupBlocker()))}ngOnDestroy(){s.r.kill(this),this._removePlugin(this.grid)}setupBlocker(){if(this.grid.isInit)if(this._blockInProgress){if(!this._blockerEmbeddedVRef){const t=this.grid.registry.getSingle("blocker");t&&(this._blockerEmbeddedVRef=this.grid.createView("afterContent",t.tRef,{$implicit:this.grid}),this._blockerEmbeddedVRef.detectChanges())}}else this._blockerEmbeddedVRef&&(this.grid.removeView(this._blockerEmbeddedVRef,"afterContent"),this._blockerEmbeddedVRef=void 0)}}return t.\u0275fac=function(e){return new(e||t)(r.Sb(n.f),r.Sb(n.m))},t.\u0275dir=r.Nb({type:t,selectors:[["pbl-ngrid","blockUi",""]],inputs:{blockUi:"blockUi"},exportAs:["blockUi"]}),t})()},"6JOf":function(t,e,c){"use strict";c.d(e,"a",function(){return l});var o=c("ofXK"),i=c("f6nW"),s=c("XEBs"),n=c("4DA5"),r=c("fXoL");let l=(()=>{class t{}return t.NGRID_PLUGIN=Object(s.u)({id:n.a},n.b),t.\u0275mod=r.Qb({type:t}),t.\u0275inj=r.Pb({factory:function(e){return new(e||t)},imports:[[o.c,i.r,s.j]]}),t})()},"87WE":function(t,e,c){"use strict";c.r(e),c.d(e,"FocusAndSelectionExampleModule",function(){return U});var o=c("mrSG"),i=c("ofXK"),s=c("bTqV"),n=c("kmnG"),r=c("d3UM"),l=c("XEBs"),b=c("6JOf"),u=c("YT2F"),a=c("WPM6"),d=c("fluT"),p=c("fXoL"),f=c("XkVd"),h=c("4DA5"),m=c("XiUz"),k=c("FKr1");function g(t,e){if(1&t&&(p.Yb(0,"mat-option",9),p.Sc(1),p.Xb()),2&t){const t=e.$implicit;p.uc("value",e.index),p.Fb(1),p.Uc(" ",t.id+" - "+t.name," ")}}function X(t,e){if(1&t&&(p.Yb(0,"mat-option",9),p.Sc(1),p.Xb()),2&t){const t=e.$implicit;p.uc("value",e.index),p.Fb(1),p.Uc(" ",t.label," ")}}let S=(()=>{let t=class{constructor(t){this.datasource=t,this.columns=Object(l.r)().table({prop:"id",sort:!0,width:"40px",wontBudge:!0},{prop:"name",sort:!0},{prop:"email",minWidth:250,width:"150px"},{prop:"address"},{prop:"rating",type:"starRatings",width:"120px"}).build(),this.ds=Object(l.s)().onTrigger(()=>this.datasource.getSellers(500)).create()}applyRange(t,e){if(e){const c=t.contextApi.focusedCell;if(c){const o=[];for(let i=0;i<e;i++){const s=t.contextApi.findRowInCache(c.rowIdent,i,!0);if(s)for(let t=0;t<e;t++)s.cells[c.colIndex+t]&&o.push({rowIdent:s.identity,colIndex:c.colIndex+t})}t.contextApi.selectCells(o,!0)}}else t.contextApi.unselectCells()}};return t.\u0275fac=function(e){return new(e||t)(p.Sb(d.a))},t.\u0275cmp=p.Mb({type:t,selectors:[["pbl-focus-and-selection-example"]],decls:34,vars:8,consts:[["blockUi","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"],["grid",""],["fxLayout","column","fxLayoutGap","16px"],["fxLayout","row","fxLayoutGap","16px"],["mat-flat-button","","color","primary",3,"click"],["fRow",""],[3,"value",4,"ngFor","ngForOf"],["fCol",""],["fRange",""],[3,"value"]],template:function(t,e){if(1&t){const t=p.Zb();p.Tb(0,"pbl-ngrid",0,1),p.Yb(2,"div",2),p.Yb(3,"div",3),p.Yb(4,"button",4),p.jc("click",function(){p.Fc(t);const e=p.Cc(10),c=p.Cc(16);return p.Cc(1).contextApi.focusCell({rowIdent:e.value,colIndex:c.value},!0)}),p.Sc(5,"Set Focus:"),p.Xb(),p.Yb(6,"mat-form-field"),p.Yb(7,"mat-label"),p.Sc(8,"Row To Focus"),p.Xb(),p.Yb(9,"mat-select",null,5),p.Qc(11,g,2,2,"mat-option",6),p.Xb(),p.Xb(),p.Yb(12,"mat-form-field"),p.Yb(13,"mat-label"),p.Sc(14,"Column To Focus"),p.Xb(),p.Yb(15,"mat-select",null,7),p.Qc(17,X,2,2,"mat-option",6),p.Xb(),p.Xb(),p.Xb(),p.Yb(18,"div",3),p.Yb(19,"button",4),p.jc("click",function(){p.Fc(t);const c=p.Cc(1),o=p.Cc(25);return e.applyRange(c,o.value)}),p.Sc(20,"Set Range:"),p.Xb(),p.Yb(21,"mat-form-field"),p.Yb(22,"mat-label"),p.Sc(23,"Range Size"),p.Xb(),p.Yb(24,"mat-select",null,8),p.Yb(26,"mat-option",9),p.Sc(27,"1 X 1"),p.Xb(),p.Yb(28,"mat-option",9),p.Sc(29,"2 X 2"),p.Xb(),p.Yb(30,"mat-option",9),p.Sc(31,"3 X 3"),p.Xb(),p.Yb(32,"mat-option",9),p.Sc(33,"Clear"),p.Xb(),p.Xb(),p.Xb(),p.Xb(),p.Xb()}2&t&&(p.uc("dataSource",e.ds)("columns",e.columns),p.Fb(11),p.uc("ngForOf",e.ds.source),p.Fb(6),p.uc("ngForOf",e.columns.table.cols),p.Fb(9),p.uc("value",1),p.Fb(2),p.uc("value",2),p.Fb(2),p.uc("value",3),p.Fb(2),p.uc("value",0))},directives:[f.a,h.b,m.f,m.g,s.b,n.c,n.g,r.a,i.t,k.m],styles:[""],encapsulation:2,changeDetection:0}),t=Object(o.a)([Object(u.e)("pbl-focus-and-selection-example",{title:"Focus And Selection"}),Object(o.b)("design:paramtypes",[d.a])],t),t})(),U=(()=>{let t=class{};return t.\u0275mod=p.Qb({type:t}),t.\u0275inj=p.Pb({factory:function(e){return new(e||t)},imports:[[i.c,s.c,n.e,r.b,a.a,l.j,b.a]]}),t=Object(o.a)([Object(u.a)(S)],t),t})()},WPM6:function(t,e,c){"use strict";c.d(e,"a",function(){return r});var o=c("XiUz"),i=c("znSr"),s=c("YT2F"),n=c("fXoL");let r=(()=>{class t{}return t.\u0275mod=n.Qb({type:t}),t.\u0275inj=n.Pb({factory:function(e){return new(e||t)},imports:[[o.i,i.e,s.l],o.i,i.e,s.l]}),t})()}}]);