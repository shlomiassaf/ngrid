(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[3602],{70946:(t,e,i)=>{"use strict";i.d(e,{a:()=>l});var s=i(3722),o=i(20377),c=i(91668),r=i(31572);let l=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=r.oAB({type:t}),t.\u0275inj=r.cJS({imports:[[s.ae,o.aT,c.RF],s.ae,o.aT,c.RF]}),t})()},3602:(t,e,i)=>{"use strict";i.r(e),i.d(e,{VirtualScrollExampleModule:()=>x});var s=i(64762),o=i(61511),c=i(54810),r=i(64914),l=i(89393),n=i(91668),a=i(70946),u=i(46418),d=i(31572),p=i(88853),g=i(31486),h=i(2367),b=i(28861),m=i(90814);function k(t,e){if(1&t&&d._UZ(0,"pbl-ngrid",13),2&t){const t=d.oxw(2);d.Q6J("dataSource",t.ds)("columns",t.columns)}}function S(t,e){if(1&t&&d._UZ(0,"pbl-ngrid",14),2&t){const t=d.oxw(2);d.Q6J("dataSource",t.ds)("columns",t.columns)}}function f(t,e){if(1&t&&d._UZ(0,"pbl-ngrid",15),2&t){const t=d.oxw(2);d.Q6J("dataSource",t.ds)("columns",t.columns)}}function U(t,e){if(1&t&&d._UZ(0,"pbl-ngrid",16),2&t){const t=d.oxw(2);d.Q6J("dataSource",t.ds)("columns",t.columns)}}function _(t,e){if(1&t&&(d.ynx(0,8),d.YNc(1,k,1,2,"pbl-ngrid",9),d.YNc(2,S,1,2,"pbl-ngrid",10),d.YNc(3,f,1,2,"pbl-ngrid",11),d.YNc(4,U,1,2,"pbl-ngrid",12),d.BQk()),2&t){d.oxw();const t=d.MAs(1);d.Q6J("ngSwitch",t.value),d.xp6(1),d.Q6J("ngSwitchCase","auto"),d.xp6(1),d.Q6J("ngSwitchCase","fixed"),d.xp6(1),d.Q6J("ngSwitchCase","dynamic"),d.xp6(1),d.Q6J("ngSwitchCase","none")}}let v=(()=>{let t=class{constructor(t){this.datasource=t,this.columns=(0,r.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=this.createDatasource()}removeDatasource(){this.ds&&(this.ds.dispose(),this.ds=void 0)}createDatasource(){return(0,r.AV)().onTrigger(()=>this.datasource.getPeople(0,1500)).create()}};return t.\u0275fac=function(e){return new(e||t)(d.Y36(u.BQ))},t.\u0275cmp=d.Xpm({type:t,selectors:[["pbl-virtual-scroll-example"]],decls:13,vars:2,consts:[["value","auto",3,"change"],["rdGroup","matRadioGroup"],["value","auto"],["value","fixed"],["value","dynamic"],["value","none"],[3,"ngSwitch",4,"ngIf"],["mat-button","",3,"disabled","click"],[3,"ngSwitch"],["blockUi","","vScrollAuto","",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollFixed","48",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollDynamic","",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollNone","",3,"dataSource","columns",4,"ngSwitchCase"],["blockUi","","vScrollAuto","",3,"dataSource","columns"],["blockUi","","vScrollFixed","48",3,"dataSource","columns"],["blockUi","","vScrollDynamic","",3,"dataSource","columns"],["blockUi","","vScrollNone","",3,"dataSource","columns"]],template:function(t,e){1&t&&(d.TgZ(0,"mat-radio-group",0,1),d.NdJ("change",function(){return e.removeDatasource()}),d.TgZ(2,"mat-radio-button",2),d._uU(3,"Auto Size"),d.qZA(),d.TgZ(4,"mat-radio-button",3),d._uU(5,"Fixed Size"),d.qZA(),d.TgZ(6,"mat-radio-button",4),d._uU(7,"Dynamic Size"),d.qZA(),d.TgZ(8,"mat-radio-button",5),d._uU(9,"No Virtual Scroll"),d.qZA(),d.qZA(),d.YNc(10,_,5,5,"ng-container",6),d.TgZ(11,"button",7),d.NdJ("click",function(){return e.ds=e.createDatasource()}),d._uU(12,"Load Data"),d.qZA()),2&t&&(d.xp6(10),d.Q6J("ngIf",e.ds),d.xp6(1),d.Q6J("disabled",e.ds))},directives:[c.VQ,c.U0,o.O5,o.RF,o.n9,p.eZ,g.C,h.B,b.R,m.U],styles:[""],encapsulation:2,changeDetection:0}),t=(0,s.gn)([(0,n.en)("pbl-virtual-scroll-example",{title:"Virtual Scroll"}),(0,s.w6)("design:paramtypes",[u.BQ])],t),t})();var w=i(720);let Z=(()=>{let t=class{constructor(t){this.datasource=t,this.columns=(0,r.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=this.createDatasource(),this.scrollingState=0}createDatasource(){return(0,r.AV)().onTrigger(()=>this.datasource.getPeople(0,1500)).create()}setIsScrolling(t){this.scrollingState=t,t&&(this.lastScrollDirection=1===t?"END":"START")}};return t.\u0275fac=function(e){return new(e||t)(d.Y36(u.BQ))},t.\u0275cmp=d.Xpm({type:t,selectors:[["pbl-scrolling-state-example"]],decls:12,vars:4,consts:[[3,"dataSource","columns","scrolling"],[1,"virtual-scroll-css-scrolling-demo-on"],[1,"virtual-scroll-css-scrolling-demo-off"]],template:function(t,e){1&t&&(d.TgZ(0,"pbl-ngrid",0),d.NdJ("scrolling",function(t){return e.setIsScrolling(t)}),d.qZA(),d.TgZ(1,"h1"),d._uU(2,"Scrolling is "),d.TgZ(3,"span",1),d._uU(4,"ON"),d.qZA(),d.TgZ(5,"span",2),d._uU(6,"OFF"),d.qZA(),d._uU(7," - (CSS)"),d.qZA(),d.TgZ(8,"h1"),d._uU(9),d.qZA(),d.TgZ(10,"h1"),d._uU(11),d.qZA()),2&t&&(d.Q6J("dataSource",e.ds)("columns",e.columns),d.xp6(9),d.hij("Scrolling is ",e.scrollingState?"ON":"OFF"," - (scrolling) event"),d.xp6(2),d.hij("Last Scrolling Direction: ",e.lastScrollDirection,""))},directives:[p.eZ,w.A],styles:["pbl-ngrid+h1 .virtual-scroll-css-scrolling-demo-on{display:none}.pbl-ngrid-scrolling+h1 .virtual-scroll-css-scrolling-demo-on{display:inline}.pbl-ngrid-scrolling+h1 .virtual-scroll-css-scrolling-demo-off{display:none}"],encapsulation:2,changeDetection:0}),t=(0,s.gn)([(0,n.en)("pbl-scrolling-state-example",{title:"Scrolling State"}),(0,s.w6)("design:paramtypes",[u.BQ])],t),t})(),x=(()=>{let t=class{};return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=d.oAB({type:t}),t.\u0275inj=d.cJS({imports:[[o.ez,c.Fk,a.a,r.dC,l.sj]]}),t=(0,s.gn)([(0,n.qB)(v,Z)],t),t})()},89393:(t,e,i)=>{"use strict";i.d(e,{sj:()=>n}),i(90366);var s=i(31486),o=i(61511),c=i(20531),r=i(64914),l=i(31572);let n=(()=>{class t{}return t.NGRID_PLUGIN=(0,r.Ic)({id:s.d},s.C),t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=l.oAB({type:t}),t.\u0275inj=l.cJS({imports:[[o.ez,c.HT,r.dC]]}),t})()},31486:(t,e,i)=>{"use strict";i.d(e,{d:()=>n,C:()=>a});var s=i(4710),o=i(19861),c=i(7997),r=i(64914),l=i(31572);const n="blockUi";let a=(()=>{class t{constructor(t,e){this.grid=t,this._blockInProgress=!1,this._removePlugin=e.setPlugin(n,this),t.registry.changes.subscribe(t=>{for(const e of t)switch(e.type){case"blocker":this.setupBlocker()}}),e.onInit().subscribe(t=>{t&&this._blockUi&&"boolean"==typeof this._blockUi&&this.setupBlocker()}),e.events.subscribe(t=>{if("onDataSource"===t.kind){const{prev:e,curr:i}=t;e&&c.dW.kill(this,e),i.onSourceChanging.pipe((0,c.dW)(this,i)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!0,this.setupBlocker())}),i.onSourceChanged.pipe((0,c.dW)(this,i)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!1,this.setupBlocker())})}})}get blockUi(){return this._blockUi}set blockUi(t){let e=(0,o.Ig)(t);!e||"auto"!==t&&""!==t||(e="auto"),(0,s.b)(t)&&this._blockUi!==t?((0,s.b)(this._blockUi)&&c.dW.kill(this,this._blockUi),this._blockUi=t,t.pipe((0,c.dW)(this,this._blockUi)).subscribe(t=>{this._blockInProgress=t,this.setupBlocker()})):this._blockUi!==e&&(this._blockUi=e,"auto"!==e&&(this._blockInProgress=e,this.setupBlocker()))}ngOnDestroy(){c.dW.kill(this),this._removePlugin(this.grid)}setupBlocker(){if(this.grid.isInit)if(this._blockInProgress){if(!this._blockerEmbeddedVRef){const t=this.grid.registry.getSingle("blocker");t&&(this._blockerEmbeddedVRef=this.grid.createView("afterContent",t.tRef,{$implicit:this.grid}),this._blockerEmbeddedVRef.detectChanges())}}else this._blockerEmbeddedVRef&&(this.grid.removeView(this._blockerEmbeddedVRef,"afterContent"),this._blockerEmbeddedVRef=void 0)}}return t.\u0275fac=function(e){return new(e||t)(l.Y36(r.eZ),l.Y36(r.q5))},t.\u0275dir=l.lG2({type:t,selectors:[["pbl-ngrid","blockUi",""]],inputs:{blockUi:"blockUi"},exportAs:["blockUi"]}),t})()},90366:(t,e,i)=>{"use strict";i.d(e,{r:()=>c});var s=i(64914),o=i(31572);let c=(()=>{class t extends s.iT{constructor(t,e){super(t,e),this.kind="blocker"}}return t.\u0275fac=function(e){return new(e||t)(o.Y36(o.Rgc),o.Y36(s.B6))},t.\u0275dir=o.lG2({type:t,selectors:[["","pblNgridBlockUiDef",""]],features:[o.qOj]}),t})()}}]);