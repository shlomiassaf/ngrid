(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{WPM6:function(e,t,i){"use strict";i.d(t,"a",function(){return c});var a=i("XiUz"),n=i("znSr"),r=i("YT2F"),o=i("fXoL");let c=(()=>{class e{}return e.\u0275mod=o.Qb({type:e}),e.\u0275inj=o.Pb({factory:function(t){return new(t||e)},imports:[[a.i,n.e,r.l],a.i,n.e,r.l]}),e})()},hvAk:function(e,t,i){"use strict";i.r(t),i.d(t,"GridHeightGridExampleModule",function(){return v});var a=i("mrSG"),n=i("ofXK"),r=i("bSwM"),o=i("bTqV"),c=i("d3UM"),l=i("XEBs"),s=i("YT2F"),d=i("WPM6"),b=i("fXoL"),p=i("fluT"),u=i("XiUz"),h=i("kmnG"),g=i("FKr1"),f=i("XkVd"),m=i("7WRX");function w(e,t){if(1&e&&(b.Yb(0,"div"),b.Tb(1,"pbl-ngrid",14),b.Xb()),2&e){const e=b.kc();b.Gb(1),b.Gc("height",e.settings.explicitGridHeight),b.rc("dataSource",e.ds)("columns",e.columns)("minDataViewHeight",e.settings.minDataViewHeight)}}let x=(()=>{let e=class{constructor(e,t){this.datasource=e,this.cdr=t,this.columns=Object(l.s)().default({minWidth:40}).table({prop:"id",width:"40px"},{prop:"name"},{prop:"gender",width:"50px"},{prop:"email",width:"150px"},{prop:"country"},{prop:"language"}).header({id:"header1",label:"Header 1",width:"25%"},{id:"header2",label:"Header 2"}).headerGroup({prop:"name",span:1,label:"Name & Gender"}).header({id:"header3",label:"Header 3"}).headerGroup({prop:"id",span:2,label:"ID, Name & Gender"},{prop:"country",span:1,label:"Country & Language"}).footer({id:"footer1",label:"Footer 1",width:"25%"},{id:"footer2",label:"Footer 2"}).footer({id:"footer3",label:"Footer 3"}).build(),this.ds=Object(l.t)().keepAlive().onTrigger(()=>this.datasource.getPeople(0,500)).create(),this.explicitGridHeight="",this.minDataViewHeight="-3",this.createSettings()}ngOnDestroy(){this.ds.dispose()}redraw(){this.settings=void 0,setTimeout(()=>{this.createSettings(),this.cdr.detectChanges()},50)}createSettings(){this.settings={explicitGridHeight:this.explicitGridHeight?this.explicitGridHeight+"px":null,minDataViewHeight:Number(this.minDataViewHeight)}}};return e.\u0275fac=function(t){return new(t||e)(b.Sb(p.a),b.Sb(b.h))},e.\u0275cmp=b.Mb({type:e,selectors:[["pbl-grid-height-grid-example"]],decls:29,vars:3,consts:[["fxLayout","row","fxLayoutGap","16px",2,"width","100%","padding","16px"],["appearance","legacy"],[3,"value","selectionChange"],["value","300"],["value","500"],["value","750"],["value",""],["value","150"],["value","-3"],["value","-10"],["value","0"],["fxFlex","*"],["fxFlex","noshrink","mat-flat-button","",3,"click"],[4,"ngIf"],["vScrollAuto","",3,"dataSource","columns","minDataViewHeight"]],template:function(e,t){1&e&&(b.Yb(0,"div",0),b.Yb(1,"mat-form-field",1),b.Yb(2,"mat-label"),b.Lc(3,"Set Explicit Grid Height"),b.Xb(),b.Yb(4,"mat-select",2),b.gc("selectionChange",function(e){return t.explicitGridHeight=e.value}),b.Yb(5,"mat-option",3),b.Lc(6,"300 Pixels"),b.Xb(),b.Yb(7,"mat-option",4),b.Lc(8,"500 Pixels"),b.Xb(),b.Yb(9,"mat-option",5),b.Lc(10,"750 Pixels"),b.Xb(),b.Yb(11,"mat-option",6),b.Lc(12,"None"),b.Xb(),b.Xb(),b.Xb(),b.Yb(13,"mat-form-field",1),b.Yb(14,"mat-label"),b.Lc(15,"Set minDataViewHeight"),b.Xb(),b.Yb(16,"mat-select",2),b.gc("selectionChange",function(e){return t.minDataViewHeight=e.value}),b.Yb(17,"mat-option",7),b.Lc(18,"150 Pixels"),b.Xb(),b.Yb(19,"mat-option",8),b.Lc(20,"3 Rows"),b.Xb(),b.Yb(21,"mat-option",9),b.Lc(22,"10 Rows"),b.Xb(),b.Yb(23,"mat-option",10),b.Lc(24,"None"),b.Xb(),b.Xb(),b.Xb(),b.Tb(25,"div",11),b.Yb(26,"button",12),b.gc("click",function(){return t.redraw()}),b.Lc(27,"Redraw"),b.Xb(),b.Xb(),b.Jc(28,w,2,5,"div",13)),2&e&&(b.Gb(4),b.rc("value",t.explicitGridHeight),b.Gb(12),b.rc("value",t.minDataViewHeight),b.Gb(12),b.rc("ngIf",t.settings))},directives:[u.f,u.g,h.c,h.g,c.a,g.m,u.b,o.b,n.t,f.a,m.a],styles:[""],encapsulation:2,changeDetection:0}),e=Object(a.a)([Object(s.e)("pbl-grid-height-grid-example",{title:"Grid Height Example"}),Object(a.b)("design:paramtypes",[p.a,b.h])],e),e})(),v=(()=>{let e=class{};return e.\u0275mod=b.Qb({type:e}),e.\u0275inj=b.Pb({factory:function(t){return new(t||e)},imports:[[n.c,d.a,r.b,o.c,c.b,l.k]]}),e=Object(a.a)([Object(s.a)(x)],e),e})()},mrSG:function(e,t,i){"use strict";function a(e,t,i,a){var n,r=arguments.length,o=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,a);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(o=(r<3?n(o):r>3?n(t,i,o):n(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o}function n(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}i.d(t,"a",function(){return a}),i.d(t,"b",function(){return n})}}]);