"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[158],{47528:(E,b,e)=>{e.d(b,{a:()=>K,Q:()=>w});var s=e(37340),t=e(94650),g=e(36895),f=e(97392),T=e(51572),D=e(55829),m=e(33120),C=e(87414),r=e(91665),n=e(32445),u=e(53977),p=e(28208),h=e(47739),v=e(54491),d=e(24033),_=e(80200),a=e(12358),c=e(72035);function y(o,l){1&o&&(t.TgZ(0,"div",11),t._UZ(1,"mat-spinner"),t.qZA())}function P(o,l){1&o&&(t.TgZ(0,"div",12)(1,"span"),t._uU(2,"No Results"),t.qZA()())}function x(o,l){1&o&&(t.TgZ(0,"pbl-ngrid-drag-resize",13),t._UZ(1,"span",14),t.qZA()),2&o&&t.Q6J("context",l.$implicit)("grabAreaWidth",8)}function M(o,l){1&o&&t._UZ(0,"span",15),2&o&&t.Q6J("pblNgridColumnDrag",l.$implicit.col)}function A(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.qZA()),2&o){const i=l.value;t.xp6(1),t.Oqu(i)}}function O(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.qZA()),2&o){const i=l.value;t.xp6(1),t.Oqu(i?"\u2705":"\u{1f6ab}")}}function S(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.ALo(2,"date"),t.qZA()),2&o){const i=l.value;t.xp6(1),t.Oqu(t.xi3(2,1,i,"MMM dd, yyyy"))}}function U(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.ALo(2,"number"),t.qZA()),2&o){const i=l.value;t.xp6(1),t.Oqu(t.xi3(2,1,i,"1.0-2"))}}function G(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.ALo(2,"currency"),t.qZA()),2&o){const i=l.value,N=l.col;t.xp6(1),t.Oqu(t.gM2(2,1,i,N.type.data,"symbol","1.0-2"))}}function Z(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.ALo(2,"date"),t.qZA()),2&o){const i=l.value;t.xp6(1),t.Oqu(t.xi3(2,1,i,"MMM dd, yyyy HH:mm"))}}function B(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.qZA()),2&o){const i=l.col;t.xp6(1),t.Oqu(i.label)}}function I(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.qZA()),2&o){const i=l.col;t.xp6(1),t.Oqu(i.label)}}function L(o,l){1&o&&t._UZ(0,"div")}function R(o,l){1&o&&t._UZ(0,"div",19)}function Y(o,l){1&o&&(t.TgZ(0,"div",16)(1,"mat-icon",17),t._uU(2,"drag_handle"),t.qZA(),t.YNc(3,R,1,0,"div",18),t.qZA()),2&o&&t.Q6J("pblNgridRowDrag",l.$implicit)}function W(o,l){if(1&o&&(t.TgZ(0,"div"),t._uU(1),t.qZA()),2&o){const i=l.value;t.xp6(1),t.xDo(" ",i>=1?"\u2605":"\u2606"," ",i>=2?"\u2605":"\u2606"," ",i>=3?"\u2605":"\u2606"," ",i>=4?"\u2605":"\u2606"," ",5===i?"\u2605":"\u2606","\n")}}function J(o,l){if(1&o&&(t.TgZ(0,"div",20)(1,"div",21)(2,"div"),t._uU(3),t.qZA()()()),2&o){const i=l.value,N=l.col;t.xp6(1),t.Udp("width",i+"%"),t.Q6J("ngStyle",N.type.data.style(i)),t.xp6(2),t.hij("",i,"%")}}let K=(()=>{class o{}return o.\u0275fac=function(i){return new(i||o)},o.\u0275cmp=t.Xpm({type:o,selectors:[["pbl-demo-common-grid-templates"]],decls:16,vars:12,consts:[["class","pbl-ngrid-ui-block",4,"pblNgridBlockUiDef"],["class","pbl-ngrid-no-data",4,"pblNgridNoDataRef"],[3,"context","grabAreaWidth",4,"pblNgridCellResizerRef"],["cdkDragRootElementClass","cdk-drag column-reorder-handle",3,"pblNgridColumnDrag",4,"pblNgridCellDraggerRef"],[4,"pblNgridCellDef"],[4,"pblNgridCellTypeDef"],[4,"pblNgridHeaderCellDef"],[4,"pblNgridFooterCellDef"],[4,"pblNgridHeaderCellTypeDef"],["cdkDragRootElement","pbl-ngrid-row","style","cursor: move",3,"pblNgridRowDrag",4,"pblNgridCellTypeDef"],["style","width:  100%;",4,"pblNgridCellTypeDef"],[1,"pbl-ngrid-ui-block"],[1,"pbl-ngrid-no-data"],[3,"context","grabAreaWidth"],[1,"pbl-ngrid-column-resizer-handle"],["cdkDragRootElementClass","cdk-drag column-reorder-handle",3,"pblNgridColumnDrag"],["cdkDragRootElement","pbl-ngrid-row",2,"cursor","move",3,"pblNgridRowDrag"],["pblDragHandle","",1,"pbl-ngrid-row-drag-handle"],["class","pbl-ngrid-row-drag-placeholder",4,"cdkDragPlaceholder"],[1,"pbl-ngrid-row-drag-placeholder"],[2,"width","100%"],[3,"ngStyle"]],template:function(i,N){1&i&&(t.YNc(0,y,2,0,"div",0),t.YNc(1,P,3,0,"div",1),t.YNc(2,x,2,2,"pbl-ngrid-drag-resize",2),t.YNc(3,M,1,1,"span",3),t.YNc(4,A,2,1,"div",4),t.YNc(5,O,2,1,"div",5),t.YNc(6,S,3,4,"div",5),t.YNc(7,U,3,4,"div",5),t.YNc(8,G,3,6,"div",5),t.YNc(9,Z,3,4,"div",5),t.YNc(10,B,2,1,"div",6),t.YNc(11,I,2,1,"div",7),t.YNc(12,L,1,0,"div",8),t.YNc(13,Y,4,1,"div",9),t.YNc(14,W,2,5,"div",5),t.YNc(15,J,4,4,"div",10)),2&i&&(t.xp6(4),t.Q6J("pblNgridCellDef","*"),t.xp6(1),t.Q6J("pblNgridCellTypeDef","visualBool"),t.xp6(1),t.Q6J("pblNgridCellTypeDef","date"),t.xp6(1),t.Q6J("pblNgridCellTypeDef","number"),t.xp6(1),t.Q6J("pblNgridCellTypeDef","currency"),t.xp6(1),t.Q6J("pblNgridCellTypeDef","datetime"),t.xp6(1),t.Q6J("pblNgridHeaderCellDef","*"),t.xp6(1),t.Q6J("pblNgridFooterCellDef","*"),t.xp6(1),t.Q6J("pblNgridHeaderCellTypeDef","drag_and_drop_handle"),t.xp6(1),t.Q6J("pblNgridCellTypeDef","drag_and_drop_handle"),t.xp6(1),t.Q6J("pblNgridCellTypeDef","starRatings"),t.xp6(1),t.Q6J("pblNgridCellTypeDef","progressBar"))},dependencies:[g.PC,f.Hw,T.Ou,D.Zl,m.u,C.d,r.T,n.I,u.Hk,p.Q,h.W,v.O,d.q,_.S,a.q,c.r,g.JJ,g.H9,g.uU],styles:[".pbl-ngrid-ui-block{position:absolute;inset:0;background:rgba(0,0,0,.15);z-index:1000;display:flex;align-items:center;justify-content:center}.pbl-ngrid-no-data{display:flex;place-content:center center;position:absolute;inset:0;pointer-events:none}.pbl-ngrid-no-data>*{margin:auto}.pbl-row-detail-parent:focus{outline:none}.pbl-row-detail-parent.pbl-row-detail-opened{background:#f5f5f5}.pbl-detail-row{padding:10px 40px;overflow:hidden}.pbl-ngrid-row-drag-handle{position:absolute;top:50%;transform:translateY(-50%)}.pbl-ngrid-row-drag-placeholder{background:#ccc;border:dotted 3px #999;min-height:60px;transition:transform .25s cubic-bezier(0,0,.2,1)}.pbl-ngrid-column-type-progressBar.pbl-ngrid-cell{position:relative}.pbl-ngrid-column-type-progressBar.pbl-ngrid-cell>div>div{position:absolute;top:0;height:100%;left:0}.pbl-ngrid-column-type-progressBar.pbl-ngrid-cell>div>div>div{width:100%;height:100%;display:flex;place-content:center;align-items:center}.pbl-ngrid:not(.pbl-ngrid-scrolling) .pbl-ngrid-column-type-progressBar.pbl-ngrid-cell>div>div{width:0;transition:width .35s cubic-bezier(.075,.82,.165,1)}.column-reorder-handle{cursor:move}\n"],encapsulation:2,data:{animation:[(0,s.X$)("detailExpand",[(0,s.SB)("void",(0,s.oB)({height:"0px",minHeight:"0",visibility:"hidden"})),(0,s.SB)("*",(0,s.oB)({height:"*",visibility:"visible"})),(0,s.eR)("void <=> *",(0,s.jt)("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))])]},changeDetection:0}),o})();var F=e(14625),Q=e(67513),H=e(41689),z=e(27569);e(63720);let w=(()=>{class o{}return o.\u0275fac=function(i){return new(i||o)},o.\u0275mod=t.oAB({type:o}),o.\u0275inj=t.cJS({imports:[g.ez,f.Ps,T.Cq,z.a,F.dC,Q.Ij.withDefaultTemplates(),H.sj]}),o})()},81929:(E,b,e)=>{e.d(b,{y:()=>r});var s=e(36895),t=e(98184),g=e(10266),f=e(3805),T=e(14625),D=e(42502),m=e(68011),C=e(94650);class r{constructor(u,p){u||T.q5.created.subscribe(h=>{const v=p.get(m.k.PLUGIN_KEY);if(v&&!0===v.autoSetAll){const d=h.controller;d.onInit().subscribe(_=>d.ensurePlugin(m.k.PLUGIN_KEY))}})}}r.NGRID_PLUGIN=(0,T.Ic)({id:m.d,factory:"create"},m.k),r.\u0275fac=function(u){return new(u||r)(C.LFG(r,12),C.LFG(f.f8))},r.\u0275mod=C.oAB({type:r}),r.\u0275inj=C.cJS({imports:[s.ez,g.AV,t.U8,T.dC,D.sx,g.AV]})},68011:(E,b,e)=>{e.d(b,{d:()=>p,k:()=>v});var s=e(94650),t=e(36895),g=e(21281),f=e(12687),T=e(40445),D=e(98184),m=e(67376),C=e(83353),r=e(10266),n=e(3805),u=e(14625);const p="cellTooltip",h={canShow:d=>{const _=d.cellTarget.firstElementChild||d.cellTarget;return _.scrollWidth>_.offsetWidth},message:d=>d.cellTarget.innerText};let v=(()=>{class d{constructor(a,c,y){this.table=a,this.injector=c,this._removePlugin=y.setPlugin(p,this);const P=c.get(n.f8);this.initArgs=[c.get(D.aV),null,c.get(m.mF),c.get(s.s_b),c.get(s.R0b),c.get(C.t4),c.get(f.$s),c.get(f.tE),c.get(r.cV),c.get(T.Is),c.get(r.Jm),c.get(t.K0)],P.onUpdate("cellTooltip").pipe((0,n.dW)(this)).subscribe(x=>this.lastConfig=x.curr),y.onInit().subscribe(()=>this.init(y))}set canShow(a){this._canShow="function"==typeof a?a:""===a?void 0:(0,g.Ig)(a)?c=>!0:c=>!1}static create(a,c){return new d(a,c,u.q5.find(a))}ngOnDestroy(){this._removePlugin(this.table),this.killTooltip(),n.dW.kill(this)}init(a){const c=a.getPlugin("targetEvents")||a.createPlugin("targetEvents");c.cellEnter.pipe((0,n.dW)(this)).subscribe(y=>this.cellEnter(y)),c.cellLeave.pipe((0,n.dW)(this)).subscribe(y=>this.cellLeave(y))}cellEnter(a){if(this.killTooltip(),this._canShow||(this.canShow=this.lastConfig&&this.lastConfig.canShow||h.canShow),this._canShow(a)){const c=this.initArgs.slice();c[1]=new s.SBq(a.cellTarget),this.toolTip=new r.gM(...c),this.toolTip.message=(this.message||this.lastConfig&&this.lastConfig.message||h.message)(a),this.position&&(this.toolTip.position=this.position),this.tooltipClass&&(this.toolTip.tooltipClass=this.tooltipClass),this.showDelay>=0&&(this.toolTip.showDelay=this.showDelay),this.hideDelay>=0&&(this.toolTip.hideDelay=this.hideDelay),this.toolTip.show()}}cellLeave(a){this.killTooltip()}killTooltip(){this.toolTip&&(this.toolTip.hide(),this.toolTip.ngOnDestroy(),this.toolTip=void 0)}}return d.PLUGIN_KEY=p,d.\u0275fac=function(a){return new(a||d)(s.Y36(u.eZ),s.Y36(s.zs3),s.Y36(u.q5))},d.\u0275dir=s.lG2({type:d,selectors:[["","cellTooltip",""]],inputs:{canShow:["cellTooltip","canShow"],message:"message",position:"position",tooltipClass:"tooltipClass",showDelay:"showDelay",hideDelay:"hideDelay"},exportAs:["pblOverflowTooltip"]}),d})()},77909:(E,b,e)=>{e.d(b,{d:()=>C});var s=e(33168),t=e(36895),g=e(96308),f=e(4859),T=e(14625);class D extends T.id{constructor(n){super(),this.cfr=n,this.name="sortContainer",this.kind="dataHeaderExtensions",this.projectContent=!0}shouldRender(n){return!!n.col.sort&&!!n.injector.get(g.YE,!1)}getFactory(n){return this.cfr.resolveComponentFactory(g.nU)}onCreated(n,u){this.deregisterId(n,u.instance.id=n.col.id),u.changeDetectorRef.markForCheck()}deregisterId(n,u){const p=n.injector.get(g.YE),h=p.sortables.get(u);h&&p.deregister(h)}}var m=e(94650);class C{constructor(n,u){this.registry=n,n.addMulti("dataHeaderExtensions",new D(u))}}C.NGRID_PLUGIN=(0,T.Ic)({id:s.d},s.u),C.\u0275fac=function(n){return new(n||C)(m.LFG(T.B6),m.LFG(m._Vd))},C.\u0275mod=m.oAB({type:C}),C.\u0275inj=m.cJS({imports:[t.ez,f.ot,g.JX,T.dC,g.JX]})},33168:(E,b,e)=>{e.d(b,{d:()=>T,u:()=>D});var s=e(3805),t=e(14625),g=e(94650),f=e(96308);const T="matSort";let D=(()=>{class m{constructor(r,n,u){this.table=r,this.pluginCtrl=n,this.sort=u,this._removePlugin=n.setPlugin(T,this);let p="click";this.sort.sortChange.pipe((0,s.dW)(this)).subscribe(v=>{this.onSort(v,p),p="click"});const h=v=>{const{column:d}=v,_=v.sort?v.sort.order:void 0;if(this.sort&&d){if(this.sort.active===d.id&&this.sort.direction===(_||""))return;const a=this.sort.sortables.get(d.id);a&&(p="ds",this.sort.active=void 0,a.start=_||"asc",a._handleClick())}else if(this.sort.active){const a=this.sort.sortables.get(this.sort.active);if(a){if(!a.disableClear){let c;for(;c=this.sort.getNextSortDirection(a);)this.sort.direction=c}p="ds",a._handleClick()}}};n.events.pipe(s.aL).subscribe(v=>{const d=this.sort&&this.sort.active;r.ds&&r.ds.sort&&(!r.ds.sort.column&&d?this.onSort({active:this.sort.active,direction:this.sort.direction||"asc"},p):r.ds.sort.column&&!d&&setTimeout(()=>h(r.ds.sort)))}),n.events.subscribe(v=>{"onDataSource"===v.kind&&(s.dW.kill(this,v.prev),this.sort&&this.sort.active&&this.onSort({active:this.sort.active,direction:this.sort.direction||"asc"},p),r.ds.sortChange.pipe((0,s.dW)(this,v.curr)).subscribe(d=>{h(d)}))})}ngOnDestroy(){this._removePlugin(this.table),s.dW.kill(this)}onSort(r,n){const u=this.table,p=u.columnApi.visibleColumns.find(h=>h.id===r.active);if("click"===n&&p&&p.sort){const h={},v="function"==typeof p.sort&&p.sort;r.direction&&(h.order=r.direction),v&&(h.sortFn=v);const d=u.ds.sort;if(p===d.column&&h.order===(d.sort||{}).order)return;u.ds.setSort(p,h)}}}return m.\u0275fac=function(r){return new(r||m)(g.Y36(t.eZ),g.Y36(t.q5),g.Y36(f.YE))},m.\u0275dir=g.lG2({type:m,selectors:[["pbl-ngrid","matSort",""]],exportAs:["pblMatSort"]}),m})()},28208:(E,b,e)=>{e.d(b,{Q:()=>g});var s=e(53977),t=e(94650);let g=(()=>{class f extends s.Bh{constructor(D,m){super(D,m),this.element=D}}return f.\u0275fac=function(D){return new(D||f)(t.Y36(t.SBq),t.Y36(s.$K,12))},f.\u0275dir=t.lG2({type:f,selectors:[["","pblDragHandle",""]],hostAttrs:[1,"cdk-drag-handle"],features:[t._Bn([{provide:s.Z8,useExisting:f}]),t.qOj]}),f})()}}]);