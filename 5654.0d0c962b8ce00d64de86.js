(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[5654],{51467:(e,t,i)=>{"use strict";i.d(t,{UY:()=>r}),i(16635);var s=i(14896),c=i(61511),o=i(29236),l=i(64914),n=i(31572);let r=(()=>{class e{}return e.NGRID_PLUGIN=(0,l.Ic)({id:s.d},s.e),e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[[c.ez,o.p9,l.dC]]}),e})()},14896:(e,t,i)=>{"use strict";i.d(t,{d:()=>l,e:()=>n});var s=i(64914),c=i(16635),o=i(31572);const l="matCheckboxSelection";let n=(()=>{class e{constructor(e,t,i,s){this.table=e,this.cfr=t,this.injector=i,this._color="primary",this._removePlugin=s.setPlugin(l,this)}get isCheckboxDisabled(){return this._isCheckboxDisabled}set isCheckboxDisabled(e){e!==this._isCheckboxDisabled&&(this._isCheckboxDisabled=e,this.cmpRef&&e&&(this.cmpRef.instance.isCheckboxDisabled=e,this.cmpRef.changeDetectorRef.detectChanges()))}get matCheckboxSelection(){return this._name}set matCheckboxSelection(e){e!==this._name&&(this._name=e,e?(this.cmpRef||(this.cmpRef=this.cfr.resolveComponentFactory(c.v).create(this.injector),this.cmpRef.instance.table=this.table,this._bulkSelectMode&&(this.cmpRef.instance.bulkSelectMode=this._bulkSelectMode),this.cmpRef.instance.color=this._color),this.isCheckboxDisabled&&(this.cmpRef.instance.isCheckboxDisabled=this.isCheckboxDisabled),this.cmpRef.instance.name=e,this.cmpRef.changeDetectorRef.detectChanges()):this.cmpRef&&(this.cmpRef.destroy(),this.cmpRef=void 0))}get bulkSelectMode(){return this._bulkSelectMode}set bulkSelectMode(e){e!==this._bulkSelectMode&&(this._bulkSelectMode=e,this.cmpRef&&(this.cmpRef.instance.bulkSelectMode=e))}get matCheckboxSelectionColor(){return this._color}set matCheckboxSelectionColor(e){e!==this._color&&(this._color=e,this.cmpRef&&(this.cmpRef.instance.color=e))}ngOnDestroy(){this.cmpRef&&this.cmpRef.destroy(),this._removePlugin(this.table)}}return e.\u0275fac=function(t){return new(t||e)(o.Y36(s.eZ),o.Y36(o._Vd),o.Y36(o.zs3),o.Y36(s.q5))},e.\u0275dir=o.lG2({type:e,selectors:[["pbl-ngrid","matCheckboxSelection",""]],inputs:{isCheckboxDisabled:"isCheckboxDisabled",matCheckboxSelection:"matCheckboxSelection",bulkSelectMode:"bulkSelectMode",matCheckboxSelectionColor:"matCheckboxSelectionColor"}}),e})()},16635:(e,t,i)=>{"use strict";i.d(t,{v:()=>g});var s=i(7997),c=i(64914),o=i(31572),l=i(65127),n=i(55992),r=i(81277),h=i(61511),d=i(29236);function b(e,t){if(1&e){const e=o.EpF();o.TgZ(0,"mat-checkbox",4),o.NdJ("click",function(e){return e.stopPropagation()})("change",function(t){o.CHM(e);const i=o.oxw(2);return t?i.masterToggle():null}),o.qZA()}if(2&e){const e=o.oxw(2);o.Q6J("color",e.color)("checked",e.allSelected)("indeterminate",e.length>0&&!e.allSelected)}}function a(e,t){if(1&e&&(o.ynx(0),o.YNc(1,b,1,3,"mat-checkbox",3),o.BQk()),2&e){const e=o.oxw();o.xp6(1),o.Q6J("ngIf","none"!==e.bulkSelectMode)}}function k(e,t){if(1&e){const e=o.EpF();o.TgZ(0,"mat-checkbox",5),o.NdJ("click",function(e){return e.stopPropagation()})("change",function(){const t=o.CHM(e).row;return o.oxw().rowItemChange(t)}),o.qZA()}if(2&e){const e=t.row,i=o.oxw();o.Q6J("color",i.color)("disabled",i.isCheckboxDisabled(e))("checked",i.selection.isSelected(e))}}function u(e,t){if(1&e&&(o.TgZ(0,"span"),o._uU(1),o.qZA()),2&e){const e=o.oxw();o.xp6(1),o.Oqu(e.length?e.length:"")}}const f=()=>!1;let g=(()=>{class e{constructor(e,t){this.table=e,this.cdr=t,this.allSelected=!1,this._isCheckboxDisabled=f,c.q5.find(e).events.pipe((0,s.dW)(this)).subscribe(e=>{"onDataSource"===e.kind&&(this.selection=e.curr.selection)})}get bulkSelectMode(){return this._bulkSelectMode}set bulkSelectMode(e){e!==this._bulkSelectMode&&(this._bulkSelectMode=e,this.setupSelection())}get selection(){return this._selection}set selection(e){e!==this._selection&&(this._selection=e,this.setupSelection())}get isCheckboxDisabled(){return this._isCheckboxDisabled}set isCheckboxDisabled(e){e!==this._isCheckboxDisabled&&(this._isCheckboxDisabled=e,this._isCheckboxDisabled&&"function"==typeof this._isCheckboxDisabled||(this._isCheckboxDisabled=f))}get color(){return this._color}set color(e){e!==this._color&&(this._color=e,this.table.isInit&&this.markAndDetect())}ngAfterViewInit(){!this.selection&&this.table.ds&&(this.selection=this.table.ds.selection);const e=this.table.registry;e.addMulti("headerCell",this.headerDef),e.addMulti("tableCell",this.cellDef),e.addMulti("footerCell",this.footerDef)}ngOnDestroy(){s.dW.kill(this)}masterToggle(){if(this.allSelected)this.selection.clear();else{const e=this.getCollection().filter(e=>!this._isCheckboxDisabled(e));this.selection.select(...e)}}rowItemChange(e){this.selection.toggle(e),this.markAndDetect()}getCollection(){const{ds:e}=this.table;return"view"===this.bulkSelectMode?e.renderedData:e.source}setupSelection(){s.dW.kill(this,this.table),this._selection?(this.length=this.selection.selected.length,this.selection.changed.pipe((0,s.dW)(this,this.table)).subscribe(()=>this.handleSelectionChanged()),("view"===this.bulkSelectMode?this.table.ds.onRenderedDataChanged:this.table.ds.onSourceChanged).pipe((0,s.dW)(this,this.table)).subscribe(()=>this.handleSelectionChanged())):this.length=0}handleSelectionChanged(){const{length:e}=this.getCollection().filter(e=>!this._isCheckboxDisabled(e));this.allSelected=!this.selection.isEmpty()&&this.selection.selected.length===e,this.length=this.selection.selected.length,this.markAndDetect()}markAndDetect(){this.cdr.markForCheck(),this.cdr.detectChanges()}}return e.\u0275fac=function(t){return new(t||e)(o.Y36(c.eZ),o.Y36(o.sBO))},e.\u0275cmp=o.Xpm({type:e,selectors:[["pbl-ngrid-checkbox"]],viewQuery:function(e,t){if(1&e&&(o.Gf(c.dl,7),o.Gf(c.Ie,7),o.Gf(c.Tl,7)),2&e){let e;o.iGM(e=o.CRH())&&(t.headerDef=e.first),o.iGM(e=o.CRH())&&(t.cellDef=e.first),o.iGM(e=o.CRH())&&(t.footerDef=e.first)}},inputs:{name:"name",bulkSelectMode:"bulkSelectMode",selection:"selection",isCheckboxDisabled:"isCheckboxDisabled",color:"color"},decls:3,vars:3,consts:[[4,"pblNgridHeaderCellDef"],["style","overflow: initial","class","pbl-ngrid-selection-checkbox",3,"color","disabled","checked","click","change",4,"pblNgridCellDef"],[4,"pblNgridFooterCellDef"],["style","overflow: initial",3,"color","checked","indeterminate","click","change",4,"ngIf"],[2,"overflow","initial",3,"color","checked","indeterminate","click","change"],[1,"pbl-ngrid-selection-checkbox",2,"overflow","initial",3,"color","disabled","checked","click","change"]],template:function(e,t){1&e&&(o.YNc(0,a,2,1,"ng-container",0),o.YNc(1,k,1,3,"mat-checkbox",1),o.YNc(2,u,2,1,"span",2)),2&e&&(o.Q6J("pblNgridHeaderCellDef",t.name),o.xp6(1),o.Q6J("pblNgridCellDef",t.name),o.xp6(1),o.Q6J("pblNgridFooterCellDef",t.name))},directives:[l.d,n.I,r.T,h.O5,d.oG],styles:[".mat-cell.pbl-ngrid-checkbox,.mat-header-cell.pbl-ngrid-checkbox{box-sizing:content-box;flex:0 0 24px;overflow:visible}.pbl-ngrid-selection-checkbox .mat-checkbox-background{transition:none}"],encapsulation:2,changeDetection:0}),e})()},89393:(e,t,i)=>{"use strict";i.d(t,{sj:()=>r}),i(90366);var s=i(31486),c=i(61511),o=i(20531),l=i(64914),n=i(31572);let r=(()=>{class e{}return e.NGRID_PLUGIN=(0,l.Ic)({id:s.d},s.C),e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[[c.ez,o.HT,l.dC]]}),e})()},31486:(e,t,i)=>{"use strict";i.d(t,{d:()=>r,C:()=>h});var s=i(4710),c=i(19861),o=i(7997),l=i(64914),n=i(31572);const r="blockUi";let h=(()=>{class e{constructor(e,t){this.grid=e,this._blockInProgress=!1,this._removePlugin=t.setPlugin(r,this),e.registry.changes.subscribe(e=>{for(const t of e)switch(t.type){case"blocker":this.setupBlocker()}}),t.onInit().subscribe(e=>{e&&this._blockUi&&"boolean"==typeof this._blockUi&&this.setupBlocker()}),t.events.subscribe(e=>{if("onDataSource"===e.kind){const{prev:t,curr:i}=e;t&&o.dW.kill(this,t),i.onSourceChanging.pipe((0,o.dW)(this,i)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!0,this.setupBlocker())}),i.onSourceChanged.pipe((0,o.dW)(this,i)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!1,this.setupBlocker())})}})}get blockUi(){return this._blockUi}set blockUi(e){let t=(0,c.Ig)(e);!t||"auto"!==e&&""!==e||(t="auto"),(0,s.b)(e)&&this._blockUi!==e?((0,s.b)(this._blockUi)&&o.dW.kill(this,this._blockUi),this._blockUi=e,e.pipe((0,o.dW)(this,this._blockUi)).subscribe(e=>{this._blockInProgress=e,this.setupBlocker()})):this._blockUi!==t&&(this._blockUi=t,"auto"!==t&&(this._blockInProgress=t,this.setupBlocker()))}ngOnDestroy(){o.dW.kill(this),this._removePlugin(this.grid)}setupBlocker(){if(this.grid.isInit)if(this._blockInProgress){if(!this._blockerEmbeddedVRef){const e=this.grid.registry.getSingle("blocker");e&&(this._blockerEmbeddedVRef=this.grid.createView("afterContent",e.tRef,{$implicit:this.grid}),this._blockerEmbeddedVRef.detectChanges())}}else this._blockerEmbeddedVRef&&(this.grid.removeView(this._blockerEmbeddedVRef,"afterContent"),this._blockerEmbeddedVRef=void 0)}}return e.\u0275fac=function(t){return new(t||e)(n.Y36(l.eZ),n.Y36(l.q5))},e.\u0275dir=n.lG2({type:e,selectors:[["pbl-ngrid","blockUi",""]],inputs:{blockUi:"blockUi"},exportAs:["blockUi"]}),e})()},90366:(e,t,i)=>{"use strict";i.d(t,{r:()=>o});var s=i(64914),c=i(31572);let o=(()=>{class e extends s.iT{constructor(e,t){super(e,t),this.kind="blocker"}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(c.Rgc),c.Y36(s.B6))},e.\u0275dir=c.lG2({type:e,selectors:[["","pblNgridBlockUiDef",""]],features:[c.qOj]}),e})()}}]);