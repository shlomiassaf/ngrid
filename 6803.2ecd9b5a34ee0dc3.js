"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[6803],{26803:(_,w,l)=>{l.d(w,{z6:()=>h}),l(58708),l(43789);var p=l(90858),f=l(36895),a=l(55013),d=l(14625),g=l(42502),R=l(77626),m=l(94650);class h{}h.NGRID_PLUGIN=(0,d.Ic)({id:R.d},p.ml),h.\u0275fac=function(c){return new(c||h)},h.\u0275mod=m.oAB({type:h}),h.\u0275inj=m.cJS({imports:[f.ez,a.HT,d.dC,g.sx]})},90858:(_,w,l)=>{l.d(w,{ml:()=>c});var o=l(94650),r=l(21281),p=l(14625),f=l(77626);class d{constructor(t,e){this.vcRef=t,this.extApi=e,this.viewMap=new Map,this.pendingOps=new Map,this.deferOps=!1,this.runMeasure=()=>this.extApi.grid.viewport.reMeasureCurrentRenderedContent(),e.onInit(()=>{this.detailRowDef=e.grid.registry.getSingle("detailRow"),e.cdkTable.beforeRenderRows.subscribe(()=>this.deferOps=!0),e.cdkTable.onRenderRows.subscribe(()=>this.flushPendingOps())}),e.grid.registry.changes.subscribe(i=>{for(const s of i)"detailRow"===s.type&&(this.detailRowDef="remove"===s.op?void 0:s.value)})}render(t,e){return this.viewMap.has(t)?(this.pendingOps.delete(t),this.updateDetailRow(t),!0):this.deferOps?!(!t.context.$implicit||!this.detailRowDef||(this.pendingOps.set(t,{type:"render",fromRender:e}),0)):this._render(t,e)}clearDetailRow(t,e){this.viewMap.get(t)&&(this.deferOps?this.pendingOps.set(t,{type:"clear",fromRender:e}):this._clearDetailRow(t,e))}updateDetailRow(t){const e=this.viewMap.get(t);e&&(Object.assign(e.viewRef.context,this.createDetailRowContext(t,!0)),e.viewRef.detectChanges())}getDetailRowHeight(t){let e=0;const i=this.viewMap.get(t);if(i)for(const s of i.viewRef.rootNodes)e+=s.getBoundingClientRect().height;return e}detectChanges(t){const e=this.viewMap.get(t);e&&e.viewRef.detectChanges()}createDetailRowContext(t,e){return{$implicit:t.context.$implicit,rowContext:t.context,animation:{fromRender:e,end:()=>this.checkHasAnimation(e)?this.runMeasure():void 0}}}flushPendingOps(){if(this.deferOps){this.deferOps=!1;const t=[],e=[];for(const i of this.pendingOps.entries())("clear"===i[1].type?e:t).push(i);this.pendingOps.clear();for(const[i,s]of t){if(this.viewMap.has(i))return;if(e.length){const[D]=e.pop();this.viewMap.set(i,this.viewMap.get(D)),this.viewMap.delete(D),this.insertElementsToRow(i),this.updateDetailRow(i),this.checkHasAnimation(s.fromRender)||this.runMeasure()}else this._render(i,s.fromRender)}for(const[i,s]of e)this._clearDetailRow(i,s.fromRender)}}_render(t,e){if(t.context.$implicit&&this.detailRowDef){const i=this.createDetailRowContext(t,e);return this.viewMap.set(t,{viewRef:this.vcRef.createEmbeddedView(this.detailRowDef.tRef,i)}),this.insertElementsToRow(t,!0),this.checkHasAnimation(e)||this.runMeasure(),!0}return!1}_clearDetailRow(t,e){const i=this.viewMap.get(t);if(i){const{viewRef:s}=i;s.context.animation.fromRender!==e&&(s.context.animation.fromRender=e,s.detectChanges()),s.destroy(),this.checkHasAnimation(e)||this.runMeasure(),this.viewMap.delete(t)}}insertElementsToRow(t,e){const{viewRef:i}=this.viewMap.get(t),s=t.element.nextSibling;for(const D of i.rootNodes)t.element.parentElement.insertBefore(D,s);e&&i.detectChanges()}checkHasAnimation(t){return"always"===this.detailRowDef.hasAnimation||"interaction"===this.detailRowDef.hasAnimation&&!t}}var g=l(58708),R=l(43789);function m(n,t){1&n&&o._UZ(0,"pbl-ngrid-row",1)}const P=()=>!0,h=()=>!1;let c=(()=>{class n{constructor(e,i,s,D){this.pluginCtrl=i,this.ngZone=s,this.injector=D,this.whenContextChange="context",this.toggleChange=new o.vpe,this.toggledRowContextChange=new o.vpe,this._isSimpleRow=P,this._isDetailRow=h,this._detailRowRows=new Set,this._removePlugin=i.setPlugin(f.d,this),this.grid=i.extApi.grid,this.detailRowCtrl=new d(e,i.extApi),i.onInit().subscribe(()=>{i.ensurePlugin("targetEvents"),this.grid.registry.changes.subscribe(v=>{for(const C of v)"detailRowParent"===C.type&&("remove"===C.op&&(this.pluginCtrl.extApi.cdkTable.removeRowDef(C.value),this._detailRowDef=void 0),this.setupDetailRowParent())}),this._detailRow?this.updateTable():this.setupDetailRowParent()})}get detailRow(){return this._detailRow}set detailRow(e){if(this._detailRow!==e){const i=this.grid;"function"==typeof e?(this._isSimpleRow=(s,D)=>!e(s,D),this._isDetailRow=e):(e=(0,r.Ig)(e),this._isDetailRow=e?P:h,this._isSimpleRow=e?h:P),this._detailRow=e,i.isInit&&this.updateTable()}}set singleDetailRow(e){if(e=(0,r.Ig)(e),this._forceSingle!==e&&(this._forceSingle=e,e&&this._openedRow&&this._openedRow.expended))for(const i of this._detailRowRows)i.context.$implicit!==this._openedRow.row&&i.toggle(!1)}addDetailRow(e){this._detailRowRows.add(e)}removeDetailRow(e){this._detailRowRows.delete(e)}toggleDetailRow(e,i){for(const s of this._detailRowRows)if(s.context.$implicit===e)return s.toggle(i),s.expended}markForCheck(){this._cdPending||(this._cdPending=!0,this.ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>{this.ngZone.run(()=>{this._cdPending=!1,this._defaultParentRef?.changeDetectorRef.markForCheck()})})))}ngOnDestroy(){this._defaultParentRef&&this._defaultParentRef.destroy(),this._removePlugin(this.grid)}detailRowToggled(e){const i=this._openedRow&&this._openedRow.row===e.row;e.expended?(this._forceSingle&&this._openedRow&&this._openedRow.expended&&!i&&this._openedRow.toggle(),this._openedRow=e):i&&(this._openedRow=void 0),this.toggleChange.emit(e)}setupDetailRowParent(){if(this._detailRowDef&&(this.pluginCtrl.extApi.cdkTable.removeRowDef(this._detailRowDef),this._detailRowDef=void 0),this.detailRow){let s=this.pluginCtrl.extApi.registry.getSingle("detailRowParent");if(s)this._detailRowDef=s=s.clone(),Object.defineProperty(s,"when",{enumerable:!0,get:()=>this._isDetailRow});else if(!this._defaultParentRef)return this._defaultParentRef=this.injector.get(o._Vd).resolveComponentFactory(u).create(this.injector),void this._defaultParentRef.changeDetectorRef.detectChanges()}this.resetTableRowDefs()}resetTableRowDefs(){this._detailRowDef&&(!1===this._detailRow?this.pluginCtrl.extApi.cdkTable.removeRowDef(this._detailRowDef):this.pluginCtrl.extApi.cdkTable.addRowDef(this._detailRowDef))}updateTable(){this.grid._tableRowDef.when=this._isSimpleRow,this.setupDetailRowParent(),this.pluginCtrl.extApi.cdkTable.updateRowDefCache(),this.pluginCtrl.extApi.cdkTable.multiTemplateDataRows=!!this._detailRow}}return n.\u0275fac=function(e){return new(e||n)(o.Y36(o.s_b),o.Y36(p.q5),o.Y36(o.R0b),o.Y36(o.zs3))},n.\u0275dir=o.lG2({type:n,selectors:[["pbl-ngrid","detailRow",""]],inputs:{detailRow:"detailRow",singleDetailRow:"singleDetailRow",excludeToggleFrom:"excludeToggleFrom",whenContextChange:"whenContextChange"},outputs:{toggleChange:"toggleChange",toggledRowContextChange:"toggledRowContextChange"},exportAs:["pblNgridDetailRow"]}),n})(),u=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275cmp=o.Xpm({type:n,selectors:[["pbl-ngrid-default-detail-row-parent"]],decls:1,vars:0,consts:[["detailRow","",4,"pblNgridDetailRowParentRef"],["detailRow",""]],template:function(e,i){1&e&&o.YNc(0,m,1,0,"pbl-ngrid-row",0)},dependencies:[g.Q,R.N],encapsulation:2}),n})()},43789:(_,w,l)=>{l.d(w,{A:()=>p,N:()=>f});var o=l(14625),r=l(94650);let p=(()=>{class a extends o.iT{constructor(g,R){super(g,R),this.kind="detailRow"}}return a.\u0275fac=function(g){return new(g||a)(r.Y36(r.Rgc),r.Y36(o.B6))},a.\u0275dir=r.lG2({type:a,selectors:[["","pblNgridDetailRowDef",""]],inputs:{hasAnimation:["pblNgridDetailRowDefHasAnimation","hasAnimation"]},features:[r.qOj]}),a})(),f=(()=>{class a extends o.rB{ngOnInit(){this.registry.setSingle("detailRowParent",this)}ngOnDestroy(){this.registry.getSingle("detailRowParent")===this&&this.registry.setSingle("detailRowParent",void 0)}}return a.\u0275fac=function(){let d;return function(R){return(d||(d=r.n5z(a)))(R||a)}}(),a.\u0275dir=r.lG2({type:a,selectors:[["","pblNgridDetailRowParentRef",""]],inputs:{columns:["pblNgridDetailRowParentRef","columns"],when:["pblNgridDetailRowParentRefWhen","when"]},features:[r.qOj]}),a})()},58708:(_,w,l)=>{l.d(w,{Q:()=>b});var o=l(94650),r=l(29521),p=l(55013),f=l(3805),a=l(14625),d=l(77626);const g=["viewRef"],R=["detailRow",""],m=[[["",8,"pbl-ngrid-row-prefix"]],[["",8,"pbl-ngrid-row-suffix"]]],P=[".pbl-ngrid-row-prefix",".pbl-ngrid-row-suffix"];let b=(()=>{class c extends a.wk{constructor(){super(...arguments),this.opened=!1}get expended(){return this.opened}get height(){return super.height+this.controller.getDetailRowHeight(this)}get row(){return this.context.$implicit}ngOnInit(){super.ngOnInit(),this.plugin.addDetailRow(this);const n=this._extApi.pluginCtrl.getPlugin("targetEvents");n.cellClick.pipe((0,f.dW)(this)).subscribe(t=>{if("data"===t.type&&t.row===this.context.$implicit){const{excludeToggleFrom:e}=this.plugin;(!e||!e.some(i=>t.column.id===i))&&this.toggle()}}),n.rowClick.pipe((0,f.dW)(this)).subscribe(t=>{!t.root&&"data"===t.type&&t.row===this.context.$implicit&&this.toggle()})}ngOnDestroy(){f.dW.kill(this),this.plugin.removeDetailRow(this),this.controller.clearDetailRow(this,!0),super.ngOnDestroy()}updateRow(){if(super.updateRow()){switch(this.plugin.whenContextChange){case"context":const n=!!this.context.getExternal("detailRow");n&&this.opened?this.controller.updateDetailRow(this):this.toggle(n,!0);break;case"render":this.opened&&this.controller.updateDetailRow(this);break;case"close":this.toggle(!1,!0)}return this.plugin.markForCheck(),this.controller.detectChanges(this),this.plugin.toggledRowContextChange.next(this),!0}return!1}toggle(n,t=!1){if(this.opened!==n){let e=!1;this.opened?(this.controller.clearDetailRow(this,t),this.element.classList.remove("pbl-row-detail-opened")):this.controller.render(this,t)&&(e=!0,this.element.classList.add("pbl-row-detail-opened")),this.opened!==e&&(this.opened=e,this.context.setExternal("detailRow",e,!0),this.plugin.detailRowToggled(this))}}handleKeydown(n){if(n.target===this.element){const t=n.keyCode;(t===r.K5||t===r.L_)&&(n.preventDefault(),this.toggle())}}onCtor(){super.onCtor(),this.plugin=this._extApi.pluginCtrl.getPlugin(d.d),this.controller=this.plugin.detailRowCtrl}}return c.\u0275fac=function(){let u;return function(t){return(u||(u=o.n5z(c)))(t||c)}}(),c.\u0275cmp=o.Xpm({type:c,selectors:[["pbl-ngrid-row","detailRow",""]],viewQuery:function(n,t){if(1&n&&o.Gf(g,7,o.s_b),2&n){let e;o.iGM(e=o.CRH())&&(t._viewRef=e.first)}},hostAttrs:["role","row",1,"pbl-ngrid-row","pbl-row-detail-parent"],hostVars:1,hostBindings:function(n,t){1&n&&o.NdJ("keydown",function(i){return t.handleKeydown(i)}),2&n&&o.uIk("tabindex",t.grid.rowFocus)},exportAs:["pblNgridDetailRow"],features:[o._Bn([{provide:p._J,useExisting:c}]),o.qOj],attrs:R,ngContentSelectors:P,decls:4,vars:0,consts:[["viewRef",""]],template:function(n,t){1&n&&(o.F$t(m),o.Hsn(0),o.GkF(1,null,0),o.Hsn(3,1))},styles:[".pbl-row-detail-parent{position:relative;cursor:pointer}\n"],encapsulation:2,changeDetection:0}),c})()},77626:(_,w,l)=>{l.d(w,{d:()=>o});const o="detailRow"}}]);