(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[3943],{70946:(t,e,s)=>{"use strict";s.d(e,{a:()=>c});var i=s(3722),o=s(20377),l=s(91668),r=s(31572);let c=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=r.oAB({type:t}),t.\u0275inj=r.cJS({imports:[[i.ae,o.aT,l.RF],i.ae,o.aT,l.RF]}),t})()},83943:(t,e,s)=>{"use strict";s.r(e),s.d(e,{CellTooltipExampleModule:()=>m});var i=s(64762),o=s(61511),l=s(64914),r=s(18794),c=s(89393),n=s(91668),a=s(70946),p=s(46418),h=s(31572),d=s(88853),u=s(31486),g=s(21570);let b=(()=>{let t=class{constructor(t){this.datasource=t,this.columns=(0,l.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"}).build(),this.ds=(0,l.AV)().onTrigger(()=>this.datasource.getPeople(0,15)).create()}};return t.\u0275fac=function(e){return new(e||t)(h.Y36(p.BQ))},t.\u0275cmp=h.Xpm({type:t,selectors:[["pbl-cell-tooltip-example"]],decls:1,vars:2,consts:[["cellTooltip","","blockUi","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"]],template:function(t,e){1&t&&h._UZ(0,"pbl-ngrid",0),2&t&&h.Q6J("dataSource",e.ds)("columns",e.columns)},directives:[d.eZ,u.C,g.k],styles:[""],encapsulation:2,changeDetection:0}),t=(0,i.gn)([(0,n.en)("pbl-cell-tooltip-example",{title:"Cell Tooltip"}),(0,i.w6)("design:paramtypes",[p.BQ])],t),t})(),k=(()=>{let t=class{constructor(t){this.datasource=t,this.columns=(0,l.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"}).build(),this.ds=(0,l.AV)().onTrigger(()=>this.datasource.getPeople(0,15)).create()}getTooltipMessage(t){return`${t.colIndex} / ${t.rowIndex} -> ${t.rowIndex%2?"ODD":"EVEN"} ROW\n\n${t.cellTarget.innerText}`}};return t.\u0275fac=function(e){return new(e||t)(h.Y36(p.BQ))},t.\u0275cmp=h.Xpm({type:t,selectors:[["pbl-custom-setup-example"]],decls:2,vars:3,consts:[["blockUi","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"],["cellTooltip","","tooltipClass","my-cell-tooltip","position","above","showDelay","500","showHide","250",3,"message"]],template:function(t,e){1&t&&(h.TgZ(0,"pbl-ngrid",0),h.GkF(1,1),h.qZA()),2&t&&(h.Q6J("dataSource",e.ds)("columns",e.columns),h.xp6(1),h.Q6J("message",e.getTooltipMessage))},directives:[d.eZ,u.C,g.k],styles:[".my-cell-tooltip{background:red;font-size:18px}"],encapsulation:2,changeDetection:0}),t=(0,i.gn)([(0,n.en)("pbl-custom-setup-example",{title:"Custom Setup"}),(0,i.w6)("design:paramtypes",[p.BQ])],t),t})(),m=(()=>{let t=class{};return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=h.oAB({type:t}),t.\u0275inj=h.cJS({imports:[[o.ez,a.a,l.dC,c.sj,r.y]]}),t=(0,i.gn)([(0,n.qB)(b,k)],t),t})()},18794:(t,e,s)=>{"use strict";s.d(e,{y:()=>h});var i=s(61511),o=s(2522),l=s(46828),r=s(7997),c=s(64914),n=s(39030),a=s(21570),p=s(31572);let h=(()=>{class t{constructor(t,e){t||c.q5.created.subscribe(t=>{const s=e.get(a.k.PLUGIN_KEY);if(s&&!0===s.autoSetAll){const e=t.controller;e.onInit().subscribe(t=>e.ensurePlugin(a.k.PLUGIN_KEY))}})}}return t.NGRID_PLUGIN=(0,c.Ic)({id:a.d,factory:"create"},a.k),t.\u0275fac=function(e){return new(e||t)(p.LFG(t,12),p.LFG(r.f8))},t.\u0275mod=p.oAB({type:t}),t.\u0275inj=p.cJS({imports:[[i.ez,l.AV,o.U8,c.dC,n.sx],l.AV]}),t})()},21570:(t,e,s)=>{"use strict";s.d(e,{d:()=>g,k:()=>k});var i=s(31572),o=s(61511),l=s(19861),r=s(24621),c=s(22526),n=s(2522),a=s(82479),p=s(11353),h=s(46828),d=s(7997),u=s(64914);const g="cellTooltip",b={canShow:t=>{const e=t.cellTarget.firstElementChild||t.cellTarget;return e.scrollWidth>e.offsetWidth},message:t=>t.cellTarget.innerText};let k=(()=>{class t{constructor(t,e,s){this.table=t,this.injector=e,this._removePlugin=s.setPlugin(g,this);const l=e.get(d.f8);this.initArgs=[e.get(n.aV),null,e.get(a.mF),e.get(i.s_b),e.get(i.R0b),e.get(p.t4),e.get(r.$s),e.get(r.tE),e.get(h.cV),e.get(c.Is),e.get(h.Jm),e.get(o.K0)],l.onUpdate("cellTooltip").pipe((0,d.dW)(this)).subscribe(t=>this.lastConfig=t.curr),s.onInit().subscribe(()=>this.init(s))}set canShow(t){this._canShow="function"==typeof t?t:""===t?void 0:(0,l.Ig)(t)?t=>!0:t=>!1}static create(e,s){return new t(e,s,u.q5.find(e))}ngOnDestroy(){this._removePlugin(this.table),this.killTooltip(),d.dW.kill(this)}init(t){const e=t.getPlugin("targetEvents")||t.createPlugin("targetEvents");e.cellEnter.pipe((0,d.dW)(this)).subscribe(t=>this.cellEnter(t)),e.cellLeave.pipe((0,d.dW)(this)).subscribe(t=>this.cellLeave(t))}cellEnter(t){if(this.killTooltip(),this._canShow||(this.canShow=this.lastConfig&&this.lastConfig.canShow||b.canShow),this._canShow(t)){const e=this.initArgs.slice();e[1]=new i.SBq(t.cellTarget),this.toolTip=new h.gM(...e),this.toolTip.message=(this.message||this.lastConfig&&this.lastConfig.message||b.message)(t),this.position&&(this.toolTip.position=this.position),this.tooltipClass&&(this.toolTip.tooltipClass=this.tooltipClass),this.showDelay>=0&&(this.toolTip.showDelay=this.showDelay),this.hideDelay>=0&&(this.toolTip.hideDelay=this.hideDelay),this.toolTip.show()}}cellLeave(t){this.killTooltip()}killTooltip(){this.toolTip&&(this.toolTip.hide(),this.toolTip.ngOnDestroy(),this.toolTip=void 0)}}return t.PLUGIN_KEY=g,t.\u0275fac=function(e){return new(e||t)(i.Y36(u.eZ),i.Y36(i.zs3),i.Y36(u.q5))},t.\u0275dir=i.lG2({type:t,selectors:[["","cellTooltip",""]],inputs:{canShow:["cellTooltip","canShow"],message:"message",position:"position",tooltipClass:"tooltipClass",showDelay:"showDelay",hideDelay:"hideDelay"},exportAs:["pblOverflowTooltip"]}),t})()},89393:(t,e,s)=>{"use strict";s.d(e,{sj:()=>n}),s(90366);var i=s(31486),o=s(61511),l=s(20531),r=s(64914),c=s(31572);let n=(()=>{class t{}return t.NGRID_PLUGIN=(0,r.Ic)({id:i.d},i.C),t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=c.oAB({type:t}),t.\u0275inj=c.cJS({imports:[[o.ez,l.HT,r.dC]]}),t})()},31486:(t,e,s)=>{"use strict";s.d(e,{d:()=>n,C:()=>a});var i=s(4710),o=s(19861),l=s(7997),r=s(64914),c=s(31572);const n="blockUi";let a=(()=>{class t{constructor(t,e){this.grid=t,this._blockInProgress=!1,this._removePlugin=e.setPlugin(n,this),t.registry.changes.subscribe(t=>{for(const e of t)switch(e.type){case"blocker":this.setupBlocker()}}),e.onInit().subscribe(t=>{t&&this._blockUi&&"boolean"==typeof this._blockUi&&this.setupBlocker()}),e.events.subscribe(t=>{if("onDataSource"===t.kind){const{prev:e,curr:s}=t;e&&l.dW.kill(this,e),s.onSourceChanging.pipe((0,l.dW)(this,s)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!0,this.setupBlocker())}),s.onSourceChanged.pipe((0,l.dW)(this,s)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!1,this.setupBlocker())})}})}get blockUi(){return this._blockUi}set blockUi(t){let e=(0,o.Ig)(t);!e||"auto"!==t&&""!==t||(e="auto"),(0,i.b)(t)&&this._blockUi!==t?((0,i.b)(this._blockUi)&&l.dW.kill(this,this._blockUi),this._blockUi=t,t.pipe((0,l.dW)(this,this._blockUi)).subscribe(t=>{this._blockInProgress=t,this.setupBlocker()})):this._blockUi!==e&&(this._blockUi=e,"auto"!==e&&(this._blockInProgress=e,this.setupBlocker()))}ngOnDestroy(){l.dW.kill(this),this._removePlugin(this.grid)}setupBlocker(){if(this.grid.isInit)if(this._blockInProgress){if(!this._blockerEmbeddedVRef){const t=this.grid.registry.getSingle("blocker");t&&(this._blockerEmbeddedVRef=this.grid.createView("afterContent",t.tRef,{$implicit:this.grid}),this._blockerEmbeddedVRef.detectChanges())}}else this._blockerEmbeddedVRef&&(this.grid.removeView(this._blockerEmbeddedVRef,"afterContent"),this._blockerEmbeddedVRef=void 0)}}return t.\u0275fac=function(e){return new(e||t)(c.Y36(r.eZ),c.Y36(r.q5))},t.\u0275dir=c.lG2({type:t,selectors:[["pbl-ngrid","blockUi",""]],inputs:{blockUi:"blockUi"},exportAs:["blockUi"]}),t})()},90366:(t,e,s)=>{"use strict";s.d(e,{r:()=>l});var i=s(64914),o=s(31572);let l=(()=>{class t extends i.iT{constructor(t,e){super(t,e),this.kind="blocker"}}return t.\u0275fac=function(e){return new(e||t)(o.Y36(o.Rgc),o.Y36(i.B6))},t.\u0275dir=o.lG2({type:t,selectors:[["","pblNgridBlockUiDef",""]],features:[o.qOj]}),t})()}}]);