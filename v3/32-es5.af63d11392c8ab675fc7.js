!function(){function t(t,n){var c;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(c=function(t,n){if(!t)return;if("string"==typeof t)return e(t,n);var c=Object.prototype.toString.call(t).slice(8,-1);"Object"===c&&t.constructor&&(c=t.constructor.name);if("Map"===c||"Set"===c)return Array.from(t);if("Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c))return e(t,n)}(t))||n&&t&&"number"==typeof t.length){c&&(t=c);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,l=!1;return{s:function(){c=t[Symbol.iterator]()},n:function(){var t=c.next();return a=t.done,t},e:function(t){l=!0,i=t},f:function(){try{a||null==c.return||c.return()}finally{if(l)throw i}}}}function e(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,c=new Array(e);n<e;n++)c[n]=t[n];return c}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function c(t,e){for(var n=0;n<e.length;n++){var c=e[n];c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(t,c.key,c)}}function r(t,e,n){return e&&c(t.prototype,e),n&&c(t,n),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{"4DA5":function(e,c,o){"use strict";o.d(c,"a",function(){return b}),o.d(c,"b",function(){return d});var i=o("7+OI"),a=o("8LU1"),l=o("DcT9"),s=o("XEBs"),u=o("fXoL"),b="blockUi",d=function(){var e=function(){function e(c,r){var o=this;n(this,e),this.grid=c,this._blockInProgress=!1,this._removePlugin=r.setPlugin(b,this),c.registry.changes.subscribe(function(e){var n,c=t(e);try{for(c.s();!(n=c.n()).done;){switch(n.value.type){case"blocker":o.setupBlocker()}}}catch(r){c.e(r)}finally{c.f()}}),r.onInit().subscribe(function(t){t&&o._blockUi&&"boolean"==typeof o._blockUi&&o.setupBlocker()}),r.events.subscribe(function(t){if("onDataSource"===t.kind){var e=t.prev,n=t.curr;e&&l.q.kill(o,e),n.onSourceChanging.pipe(Object(l.q)(o,n)).subscribe(function(){"auto"===o._blockUi&&(o._blockInProgress=!0,o.setupBlocker())}),n.onSourceChanged.pipe(Object(l.q)(o,n)).subscribe(function(){"auto"===o._blockUi&&(o._blockInProgress=!1,o.setupBlocker())})}})}return r(e,[{key:"ngOnDestroy",value:function(){l.q.kill(this),this._removePlugin(this.grid)}},{key:"setupBlocker",value:function(){if(this.grid.isInit)if(this._blockInProgress){if(!this._blockerEmbeddedVRef){var t=this.grid.registry.getSingle("blocker");t&&(this._blockerEmbeddedVRef=this.grid.createView("afterContent",t.tRef,{$implicit:this.grid}),this._blockerEmbeddedVRef.detectChanges())}}else this._blockerEmbeddedVRef&&(this.grid.removeView(this._blockerEmbeddedVRef,"afterContent"),this._blockerEmbeddedVRef=void 0)}},{key:"blockUi",get:function(){return this._blockUi},set:function(t){var e=this,n=Object(a.c)(t);!n||"auto"!==t&&""!==t||(n="auto"),Object(i.a)(t)&&this._blockUi!==t?(Object(i.a)(this._blockUi)&&l.q.kill(this,this._blockUi),this._blockUi=t,t.pipe(Object(l.q)(this,this._blockUi)).subscribe(function(t){e._blockInProgress=t,e.setupBlocker()})):this._blockUi!==n&&(this._blockUi=n,"auto"!==n&&(this._blockInProgress=n,this.setupBlocker()))}}]),e}();return e.\u0275fac=function(t){return new(t||e)(u.Ub(s.f),u.Ub(s.m))},e.\u0275dir=u.Pb({type:e,selectors:[["pbl-ngrid","blockUi",""]],inputs:{blockUi:"blockUi"},exportAs:["blockUi"]}),e}()},"6JOf":function(t,e,c){"use strict";c.d(e,"a",function(){return u});var r,o=c("ofXK"),i=c("f6nW"),a=c("XEBs"),l=c("4DA5"),s=c("fXoL"),u=((r=function t(){n(this,t)}).NGRID_PLUGIN=Object(a.u)({id:l.a},l.b),r.\u0275fac=function(t){return new(t||r)},r.\u0275mod=s.Sb({type:r}),r.\u0275inj=s.Rb({imports:[[o.c,i.r,a.j]]}),r)},WPM6:function(t,e,c){"use strict";c.d(e,"a",function(){return l});var r=c("XiUz"),o=c("znSr"),i=c("YT2F"),a=c("fXoL"),l=function(){var t=function t(){n(this,t)};return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=a.Sb({type:t}),t.\u0275inj=a.Rb({imports:[[r.e,o.b,i.l],r.e,o.b,i.l]}),t}()},Ydbu:function(t,e,c){"use strict";c.r(e),c.d(e,"VirtualScrollExampleModule",function(){return x});var o=c("mrSG"),i=c("ofXK"),a=c("QibW"),l=c("XEBs"),s=c("6JOf"),u=c("YT2F"),b=c("WPM6"),d=c("fluT"),f=c("fXoL"),p=c("XkVd"),h=c("4DA5"),g=c("7WRX"),m=c("yNqP"),S=c("z6lm");function v(t,e){if(1&t&&f.Vb(0,"pbl-ngrid",13),2&t){var n=f.pc(2);f.wc("dataSource",n.ds)("columns",n.columns)}}function k(t,e){if(1&t&&f.Vb(0,"pbl-ngrid",14),2&t){var n=f.pc(2);f.wc("dataSource",n.ds)("columns",n.columns)}}function y(t,e){if(1&t&&f.Vb(0,"pbl-ngrid",15),2&t){var n=f.pc(2);f.wc("dataSource",n.ds)("columns",n.columns)}}function w(t,e){if(1&t&&f.Vb(0,"pbl-ngrid",16),2&t){var n=f.pc(2);f.wc("dataSource",n.ds)("columns",n.columns)}}function U(t,e){if(1&t&&(f.Yb(0,8),f.Qc(1,v,1,2,"pbl-ngrid",9),f.Qc(2,k,1,2,"pbl-ngrid",10),f.Qc(3,y,1,2,"pbl-ngrid",11),f.Qc(4,w,1,2,"pbl-ngrid",12),f.Xb()),2&t){f.pc();var n=f.Ec(1);f.wc("ngSwitch",n.value),f.Hb(1),f.wc("ngSwitchCase","auto"),f.Hb(1),f.wc("ngSwitchCase","fixed"),f.Hb(1),f.wc("ngSwitchCase","dynamic"),f.Hb(1),f.wc("ngSwitchCase","none")}}var O,j,_,D=((O=function(){function t(e){n(this,t),this.datasource=e,this.columns=Object(l.r)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=this.createDatasource()}return r(t,[{key:"removeDatasource",value:function(){this.ds&&(this.ds.dispose(),this.ds=void 0)}},{key:"createDatasource",value:function(){var t=this;return Object(l.s)().onTrigger(function(){return t.datasource.getPeople(0,1500)}).create()}}]),t}()).\u0275fac=function(t){return new(t||O)(f.Ub(d.a))},O.\u0275cmp=f.Ob({type:O,selectors:[["pbl-virtual-scroll-example"]],decls:13,vars:2,consts:[["value","auto",3,"change"],["rdGroup","matRadioGroup"],["value","auto"],["value","fixed"],["value","dynamic"],["value","none"],[3,"ngSwitch",4,"ngIf"],["mat-button","",3,"disabled","click"],[3,"ngSwitch"],["blockUi","","vScrollAuto","",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollFixed","48",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollDynamic","",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollNone","",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollAuto","",3,"dataSource","columns"],["blockUi","","vScrollFixed","48",3,"dataSource","columns"],["blockUi","","vScrollDynamic","",3,"dataSource","columns"],["blockUi","","vScrollNone","",3,"dataSource","columns"]],template:function(t,e){1&t&&(f.ac(0,"mat-radio-group",0,1),f.lc("change",function(){return e.removeDatasource()}),f.ac(2,"mat-radio-button",2),f.Sc(3,"Auto Size"),f.Zb(),f.ac(4,"mat-radio-button",3),f.Sc(5,"Fixed Size"),f.Zb(),f.ac(6,"mat-radio-button",4),f.Sc(7,"Dynamic Size"),f.Zb(),f.ac(8,"mat-radio-button",5),f.Sc(9,"No Virtual Scroll"),f.Zb(),f.Zb(),f.Qc(10,U,5,5,"ng-container",6),f.ac(11,"button",7),f.lc("click",function(){return e.ds=e.createDatasource()}),f.Sc(12,"Load Data"),f.Zb()),2&t&&(f.Hb(10),f.wc("ngIf",e.ds),f.Hb(1),f.wc("disabled",e.ds))},directives:[a.b,a.a,i.p,i.r,i.s,p.a,h.b,g.a,m.a,S.a],styles:[""],encapsulation:2,changeDetection:0}),O=Object(o.a)([Object(u.e)("pbl-virtual-scroll-example",{title:"Virtual Scroll"}),Object(o.b)("design:paramtypes",[d.a])],O)),I=c("wl19"),P=((_=function(){function t(e){n(this,t),this.datasource=e,this.columns=Object(l.r)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=this.createDatasource(),this.scrollingState=0}return r(t,[{key:"createDatasource",value:function(){var t=this;return Object(l.s)().onTrigger(function(){return t.datasource.getPeople(0,1500)}).create()}},{key:"setIsScrolling",value:function(t){this.scrollingState=t,t&&(this.lastScrollDirection=1===t?"END":"START")}}]),t}()).\u0275fac=function(t){return new(t||_)(f.Ub(d.a))},_.\u0275cmp=f.Ob({type:_,selectors:[["pbl-scrolling-state-example"]],decls:12,vars:4,consts:[[3,"dataSource","columns","scrolling"],[1,"virtual-scroll-css-scrolling-demo-on"],[1,"virtual-scroll-css-scrolling-demo-off"]],template:function(t,e){1&t&&(f.ac(0,"pbl-ngrid",0),f.lc("scrolling",function(t){return e.setIsScrolling(t)}),f.Zb(),f.ac(1,"h1"),f.Sc(2,"Scrolling is "),f.ac(3,"span",1),f.Sc(4,"ON"),f.Zb(),f.ac(5,"span",2),f.Sc(6,"OFF"),f.Zb(),f.Sc(7," - (CSS)"),f.Zb(),f.ac(8,"h1"),f.Sc(9),f.Zb(),f.ac(10,"h1"),f.Sc(11),f.Zb()),2&t&&(f.wc("dataSource",e.ds)("columns",e.columns),f.Hb(9),f.Uc("Scrolling is ",e.scrollingState?"ON":"OFF"," - (scrolling) event"),f.Hb(2),f.Uc("Last Scrolling Direction: ",e.lastScrollDirection,""))},directives:[p.a,I.a],styles:["pbl-ngrid+h1 .virtual-scroll-css-scrolling-demo-on{display:none}.pbl-ngrid-scrolling+h1 .virtual-scroll-css-scrolling-demo-on{display:inline}.pbl-ngrid-scrolling+h1 .virtual-scroll-css-scrolling-demo-off{display:none}"],encapsulation:2,changeDetection:0}),_=Object(o.a)([Object(u.e)("pbl-scrolling-state-example",{title:"Scrolling State"}),Object(o.b)("design:paramtypes",[d.a])],_)),x=((j=function t(){n(this,t)}).\u0275fac=function(t){return new(t||j)},j.\u0275mod=f.Sb({type:j}),j.\u0275inj=f.Rb({imports:[[i.c,a.c,b.a,l.j,s.a]]}),j=Object(o.a)([Object(u.a)(D,P)],j))}}])}();