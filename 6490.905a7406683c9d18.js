"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[6490],{66490:(Q,k,n)=>{n.r(k),n.d(k,{SelectionColumnExampleModule:()=>d});var u=n(70655),g=n(69808),c=n(14625),b=n(3805),e=n(5e3),D=n(87414),y=n(91665),N=n(32445);function A(l,i){if(1&l){const t=e.EpF();e.TgZ(0,"label")(1,"input",4),e.NdJ("input",function(){e.CHM(t);const o=e.oxw(2);return e.KtG(o.masterToggle())}),e.qZA()()}if(2&l){const t=e.oxw(2);e.Tol(t.selectionClass),e.xp6(1),e.Q6J("checked",t.allSelected)}}function B(l,i){if(1&l&&(e.ynx(0),e.YNc(1,A,2,3,"label",3),e.BQk()),2&l){const t=e.oxw();e.xp6(1),e.Q6J("ngIf","none"!==t.bulkSelectMode)}}function T(l,i){if(1&l){const t=e.EpF();e.TgZ(0,"label")(1,"input",5),e.NdJ("input",function(){const a=e.CHM(t).row,E=e.oxw();return e.KtG(E.rowItemChange(a))}),e.qZA()()}if(2&l){const t=i.row,s=e.oxw();e.xp6(1),e.Tol(s.selectionClass),e.Q6J("checked",s.selection.isSelected(t))("disabled",s.isCheckboxDisabled(t))}}function R(l,i){if(1&l&&(e.TgZ(0,"span"),e._uU(1),e.qZA()),2&l){const t=e.oxw();e.xp6(1),e.Oqu(t.length?t.length:"")}}const x=()=>!1;let w=(()=>{class l{constructor(t,s){this.table=t,this.cdr=s,this.allSelected=!1,this._isCheckboxDisabled=x,c.q5.find(t).events.pipe((0,b.dW)(this)).subscribe(a=>{"onDataSource"===a.kind&&(this.selection=a.curr.selection)})}get bulkSelectMode(){return this._bulkSelectMode}set bulkSelectMode(t){t!==this._bulkSelectMode&&(this._bulkSelectMode=t,this.setupSelection())}get selection(){return this._selection}set selection(t){t!==this._selection&&(this._selection=t,this.setupSelection())}get isCheckboxDisabled(){return this._isCheckboxDisabled}set isCheckboxDisabled(t){t!==this._isCheckboxDisabled&&(this._isCheckboxDisabled=t,(!this._isCheckboxDisabled||"function"!=typeof this._isCheckboxDisabled)&&(this._isCheckboxDisabled=x))}get selectionClass(){return this._selectionClass}set selectionClass(t){t!==this._selectionClass&&(this._selectionClass=t,this.table.isInit&&this.markAndDetect())}ngAfterViewInit(){!this.selection&&this.table.ds&&(this.selection=this.table.ds.selection);const t=this.table.registry;t.addMulti("headerCell",this.headerDef),t.addMulti("tableCell",this.cellDef),t.addMulti("footerCell",this.footerDef)}ngOnDestroy(){b.dW.kill(this)}masterToggle(){if(this.allSelected)this.selection.clear();else{const t=this.getCollection().filter(s=>!this._isCheckboxDisabled(s));this.selection.select(...t)}}rowItemChange(t){this.selection.toggle(t),this.markAndDetect()}onInput(t,s){console.log(t,s)}getCollection(){const{ds:t}=this.table;return"view"===this.bulkSelectMode?t.renderedData:t.source}setupSelection(){b.dW.kill(this,this.table),this._selection?(this.length=this.selection.selected.length,this.selection.changed.pipe((0,b.dW)(this,this.table)).subscribe(()=>this.handleSelectionChanged()),("view"===this.bulkSelectMode?this.table.ds.onRenderedDataChanged:this.table.ds.onSourceChanged).pipe((0,b.dW)(this,this.table)).subscribe(()=>this.handleSelectionChanged())):this.length=0}handleSelectionChanged(){const{length:t}=this.getCollection().filter(s=>!this._isCheckboxDisabled(s));this.allSelected=!this.selection.isEmpty()&&this.selection.selected.length===t,this.length=this.selection.selected.length,this.markAndDetect()}markAndDetect(){this.cdr.markForCheck(),this.cdr.detectChanges()}}return l.\u0275fac=function(t){return new(t||l)(e.Y36(c.eZ),e.Y36(e.sBO))},l.\u0275cmp=e.Xpm({type:l,selectors:[["pbl-ngrid-bs-checkbox"]],viewQuery:function(t,s){if(1&t&&(e.Gf(c.dl,7),e.Gf(c.Ie,7),e.Gf(c.Tl,7)),2&t){let o;e.iGM(o=e.CRH())&&(s.headerDef=o.first),e.iGM(o=e.CRH())&&(s.cellDef=o.first),e.iGM(o=e.CRH())&&(s.footerDef=o.first)}},inputs:{name:"name",bulkSelectMode:"bulkSelectMode",selection:"selection",isCheckboxDisabled:"isCheckboxDisabled",selectionClass:"selectionClass"},decls:3,vars:3,consts:[[4,"pblNgridHeaderCellDef"],[4,"pblNgridCellDef"],[4,"pblNgridFooterCellDef"],[3,"class",4,"ngIf"],["type","checkbox",3,"checked","input"],["type","checkbox",3,"checked","disabled","input"]],template:function(t,s){1&t&&(e.YNc(0,B,2,1,"ng-container",0),e.YNc(1,T,2,4,"label",1),e.YNc(2,R,2,1,"span",2)),2&t&&(e.Q6J("pblNgridHeaderCellDef",s.name),e.xp6(1),e.Q6J("pblNgridCellDef",s.name),e.xp6(1),e.Q6J("pblNgridFooterCellDef",s.name))},dependencies:[g.O5,D.d,y.T,N.I],encapsulation:2,changeDetection:0}),l})();const _="bsSelectionColumn";let f=(()=>{class l{constructor(t,s,o,a){this.table=t,this.cfr=s,this.injector=o,this._selectionClass="",this._removePlugin=a.setPlugin(_,this)}get isCheckboxDisabled(){return this._isCheckboxDisabled}set isCheckboxDisabled(t){t!==this._isCheckboxDisabled&&(this._isCheckboxDisabled=t,this.cmpRef&&t&&(this.cmpRef.instance.isCheckboxDisabled=t,this.cmpRef.changeDetectorRef.detectChanges()))}get bsSelectionColumn(){return this._name}set bsSelectionColumn(t){t!==this._name&&(this._name=t,t?(this.cmpRef||(this.cmpRef=this.cfr.resolveComponentFactory(w).create(this.injector),this.cmpRef.instance.table=this.table,this._bulkSelectMode&&(this.cmpRef.instance.bulkSelectMode=this._bulkSelectMode),this.cmpRef.instance.selectionClass=this._selectionClass),this.isCheckboxDisabled&&(this.cmpRef.instance.isCheckboxDisabled=this.isCheckboxDisabled),this.cmpRef.instance.name=t,this.cmpRef.changeDetectorRef.detectChanges()):this.cmpRef&&(this.cmpRef.destroy(),this.cmpRef=void 0))}get bulkSelectMode(){return this._bulkSelectMode}set bulkSelectMode(t){t!==this._bulkSelectMode&&(this._bulkSelectMode=t,this.cmpRef&&(this.cmpRef.instance.bulkSelectMode=t))}get bsSelectionClass(){return this._selectionClass}set matCheckboxSelectionColor(t){t!==this._selectionClass&&(this._selectionClass=t,this.cmpRef&&(this.cmpRef.instance.selectionClass=t))}ngOnDestroy(){this.cmpRef&&this.cmpRef.destroy(),this._removePlugin(this.table)}}return l.\u0275fac=function(t){return new(t||l)(e.Y36(c.eZ),e.Y36(e._Vd),e.Y36(e.zs3),e.Y36(c.q5))},l.\u0275dir=e.lG2({type:l,selectors:[["pbl-ngrid","bsSelectionColumn",""]],inputs:{isCheckboxDisabled:"isCheckboxDisabled",bsSelectionColumn:"bsSelectionColumn",bulkSelectMode:"bulkSelectMode",bsSelectionClass:"bsSelectionClass"}}),l})();var P=n(77446);class r{}r.NGRID_PLUGIN=(0,c.Ic)({id:_},f),r.\u0275fac=function(i){return new(i||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[g.ez,P.p9,c.dC]});var C=n(88562),v=n(27569),Z=n(56138),m=n(50841),M=n(37048);let h=class{constructor(i){this.datasource=i,this.columns=(0,c.I7)().default({minWidth:100}).table({prop:"selection",width:"48px"},{prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=(0,c.AV)().onTrigger(()=>this.datasource.getPeople(0,15)).create()}};h.\u0275fac=function(i){return new(i||h)(e.Y36(m.BQ))},h.\u0275cmp=e.Xpm({type:h,selectors:[["pbl-bs-selection-column-example"]],decls:1,vars:2,consts:[["bsSelectionColumn","selection",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"]],template:function(i,t){1&i&&e._UZ(0,"pbl-ngrid",0),2&i&&e.Q6J("dataSource",t.ds)("columns",t.columns)},dependencies:[M.eZ,f],encapsulation:2,changeDetection:0}),h=(0,u.gn)([(0,C.en)("pbl-bs-selection-column-example",{title:"Selection Column"}),(0,u.w6)("design:paramtypes",[m.BQ])],h);var S=n(77093);let p=class{constructor(i){this.datasource=i,this.columns=(0,c.I7)().default({minWidth:100}).table({prop:"selection",width:"48px"},{prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=(0,c.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create(),this.bulkSelectMode="all"}};p.\u0275fac=function(i){return new(i||p)(e.Y36(m.BQ))},p.\u0275cmp=e.Xpm({type:p,selectors:[["pbl-bs-bulk-mode-and-virtual-scroll-example"]],decls:17,vars:12,consts:[["bsSelectionColumn","selection","showFooter","",1,"pbl-ngrid-cell-ellipsis",3,"bulkSelectMode","dataSource","columns"],["fxLayout","row","fxLayoutAlign","start center","fxLayoutGap","16px",2,"margin","8px 16px"],[1,"btn-group","btn-group-toggle"],[1,"btn","btn-primary"],["type","radio",3,"checked","input"],["inputAll",""],["inputView",""],["inputNone",""]],template:function(i,t){if(1&i){const s=e.EpF();e._UZ(0,"pbl-ngrid",0),e.TgZ(1,"div",1)(2,"h3"),e._uU(3,"Bulk Mode: "),e.qZA(),e.TgZ(4,"div",2)(5,"label",3)(6,"input",4,5),e.NdJ("input",function(){e.CHM(s);const a=e.MAs(7);return e.KtG(a.checked?t.bulkSelectMode="all":null)}),e.qZA(),e._uU(8," All "),e.qZA(),e.TgZ(9,"label",3)(10,"input",4,6),e.NdJ("input",function(){e.CHM(s);const a=e.MAs(11);return e.KtG(a.checked?t.bulkSelectMode="view":null)}),e.qZA(),e._uU(12," View "),e.qZA(),e.TgZ(13,"label",3)(14,"input",4,7),e.NdJ("input",function(){e.CHM(s);const a=e.MAs(15);return e.KtG(a.checked?t.bulkSelectMode="none":null)}),e.qZA(),e._uU(16," None "),e.qZA()()()}2&i&&(e.Q6J("bulkSelectMode",t.bulkSelectMode)("dataSource",t.ds)("columns",t.columns),e.xp6(5),e.ekj("active","all"===t.bulkSelectMode),e.xp6(1),e.Q6J("checked","all"===t.bulkSelectMode),e.xp6(3),e.ekj("active","view"===t.bulkSelectMode),e.xp6(1),e.Q6J("checked","view"===t.bulkSelectMode),e.xp6(3),e.ekj("active","none"===t.bulkSelectMode),e.xp6(1),e.Q6J("checked","none"===t.bulkSelectMode))},dependencies:[S.xw,S.SQ,S.Wh,M.eZ,f],encapsulation:2,changeDetection:0}),p=(0,u.gn)([(0,C.en)("pbl-bs-bulk-mode-and-virtual-scroll-example",{title:"Bulk Mode & Virtual Scroll"}),(0,u.w6)("design:paramtypes",[m.BQ])],p);let d=class{};d.\u0275fac=function(i){return new(i||d)},d.\u0275mod=e.oAB({type:d}),d.\u0275inj=e.cJS({imports:[Z.y,g.ez,v.a,c.dC,r]}),d=(0,u.gn)([(0,C.qB)(h,p)],d)}}]);