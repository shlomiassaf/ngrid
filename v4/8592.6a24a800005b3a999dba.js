(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[8592],{10192:(t,e,i)=>{"use strict";i.d(e,{J:()=>d}),i(10205);var s=i(61511),a=i(73005),n=i(4786),r=i(46828),o=i(15980),l=i(64914),h=i(31572);let d=(()=>{class t{constructor(t,e){t.resolveComponentFactory(a.NW).create(e)}}return t.\u0275fac=function(e){return new(e||t)(h.LFG(h._Vd),h.LFG(h.zs3))},t.\u0275mod=h.oAB({type:t}),t.\u0275inj=h.cJS({imports:[[s.ez,a.TU,n.LD,r.AV,o.ot,l.dC]]}),t})()},10205:(t,e,i)=>{"use strict";i.d(e,{Z:()=>C});var s=i(19861),a=i(7997),n=i(64914),r=i(31572),o=i(73005),l=i(61511),h=i(15980),d=i(46828),c=i(66283),p=i(4786),u=i(71522);function g(t,e){if(1&t&&(r.TgZ(0,"mat-option",17),r._uU(1),r.qZA()),2&t){const t=e.$implicit;r.Q6J("value",t),r.xp6(1),r.hij(" ",t," ")}}function f(t,e){if(1&t){const t=r.EpF();r.TgZ(0,"mat-form-field",14),r.TgZ(1,"mat-select",15),r.NdJ("selectionChange",function(e){return r.CHM(t),r.oxw(2).paginator.perPage=e.value}),r.YNc(2,g,2,2,"mat-option",16),r.qZA(),r.qZA()}if(2&t){const t=r.oxw(2);r.xp6(1),r.Q6J("value",t.paginator.perPage)("aria-label",t._intl.itemsPerPageLabel)("disabled",t.pageSizes[0]>=t.paginator.total&&!t.paginator.hasPrev()&&!t.paginator.hasNext()),r.xp6(1),r.Q6J("ngForOf",t.pageSizes)}}function m(t,e){if(1&t&&(r.TgZ(0,"div"),r._uU(1),r.qZA()),2&t){const t=r.oxw(2);r.xp6(1),r.Oqu(null==t.paginator?null:t.paginator.perPage)}}function b(t,e){if(1&t&&(r.TgZ(0,"div",11),r.TgZ(1,"div",12),r._uU(2),r.qZA(),r.YNc(3,f,3,4,"mat-form-field",8),r.YNc(4,m,2,1,"div",13),r.qZA()),2&t){const t=r.oxw();r.xp6(2),r.hij(" ",t._intl.itemsPerPageLabel," "),r.xp6(1),r.Q6J("ngIf",t.pageSizes.length>1),r.xp6(1),r.Q6J("ngIf",t.pageSizes.length<=1)}}function y(t,e){if(1&t&&(r.TgZ(0,"div",18),r._uU(1),r.qZA()),2&t){const t=r.oxw();r.xp6(1),r.hij(" ",t._intl.getRangeLabel(t.paginator.page-1,t.paginator.perPage,t.paginator.total)," ")}}function S(t,e){if(1&t&&(r.TgZ(0,"mat-option",17),r._uU(1),r.qZA()),2&t){const t=e.$implicit;r.Q6J("value",t),r.xp6(1),r.Oqu(t)}}function _(t,e){if(1&t){const t=r.EpF();r.O4$(),r.kcU(),r.TgZ(0,"mat-form-field",14),r.TgZ(1,"mat-select",19),r.NdJ("selectionChange",function(e){return r.CHM(t),r.oxw().paginator.page=e.value}),r.YNc(2,S,2,2,"mat-option",16),r.qZA(),r.qZA()}if(2&t){const t=r.oxw();r.xp6(1),r.Q6J("value",t.paginator.page)("disabled",1===t.paginator.totalPages),r.xp6(1),r.Q6J("ngForOf",t.pages)}}const v=[5,10,20,50,100];let C=(()=>{class t{constructor(t,e,i){this._intl=e,this.cdr=i,this.pages=[],this.pageSizes=v.slice(),this._hidePageSize=!1,this._hideRangeSelect=!1,t&&(this.grid=t),e.changes.pipe((0,a.dW)(this)).subscribe(()=>this.cdr.markForCheck())}get pageSizeOptions(){return this._pageSizeOptions}set pageSizeOptions(t){this._pageSizeOptions=t,this.pageSizes=(t||v).slice(),this.updatePageSizes()}get paginator(){return this._paginator}set paginator(t){this._paginator!==t&&(this._paginator&&a.dW.kill(this,this._paginator),this._paginator=t,t&&(t.onChange.pipe((0,a.dW)(this,t)).subscribe(t=>this.handlePageChange(t)),this.updatePageSizes()))}get table(){return this.grid}set table(t){this.grid=t}get hidePageSize(){return this._hidePageSize}set hidePageSize(t){this._hidePageSize=(0,s.Ig)(t)}get hideRangeSelect(){return this._hideRangeSelect}set hideRangeSelect(t){this._hideRangeSelect=(0,s.Ig)(t)}ngOnDestroy(){a.dW.kill(this)}updatePageSizes(){this.paginator&&-1===this.pageSizes.indexOf(this.paginator.perPage)&&this.pageSizes.push(this.paginator.perPage),this.pageSizes.sort((t,e)=>t-e)}handlePageChange(t){if(this.pages.length!==this.paginator.totalPages){const t=this.pages=[];for(let e=1,i=this.paginator.totalPages+1;e<i;e++)t.push(e)}this.cdr.detectChanges(),this.cdr.markForCheck()}}return t.\u0275fac=function(e){return new(e||t)(r.Y36(n.eZ,8),r.Y36(o.ye),r.Y36(r.sBO))},t.\u0275cmp=r.Xpm({type:t,selectors:[["pbl-ngrid-paginator"]],hostAttrs:[1,"mat-paginator"],inputs:{pageSizeOptions:"pageSizeOptions",paginator:"paginator",table:"table",grid:"grid",hidePageSize:"hidePageSize",hideRangeSelect:"hideRangeSelect"},decls:12,vars:11,consts:[[1,"mat-paginator-outer-container"],[1,"mat-paginator-container"],["class","mat-paginator-page-size",4,"ngIf"],[1,"mat-paginator-range-actions"],["class","mat-paginator-range-label",4,"ngIf"],["mat-icon-button","","type","button",1,"mat-paginator-navigation-previous",3,"matTooltip","matTooltipPosition","disabled","click"],["viewBox","0 0 24 24","focusable","false",1,"mat-paginator-icon"],["d","M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"],["class","mat-paginator-page-size-select",4,"ngIf"],["mat-icon-button","","type","button",1,"mat-paginator-navigation-next",3,"matTooltip","matTooltipPosition","disabled","click"],["d","M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"],[1,"mat-paginator-page-size"],[1,"mat-paginator-page-size-label"],[4,"ngIf"],[1,"mat-paginator-page-size-select"],[3,"value","aria-label","disabled","selectionChange"],[3,"value",4,"ngFor","ngForOf"],[3,"value"],[1,"mat-paginator-range-label"],[3,"value","disabled","selectionChange"]],template:function(t,e){1&t&&(r.TgZ(0,"div",0),r.TgZ(1,"div",1),r.YNc(2,b,5,3,"div",2),r.TgZ(3,"div",3),r.YNc(4,y,2,1,"div",4),r.TgZ(5,"button",5),r.NdJ("click",function(){return e.paginator.prevPage()}),r.O4$(),r.TgZ(6,"svg",6),r._UZ(7,"path",7),r.qZA(),r.qZA(),r.YNc(8,_,3,3,"mat-form-field",8),r.kcU(),r.TgZ(9,"button",9),r.NdJ("click",function(){return e.paginator.nextPage()}),r.O4$(),r.TgZ(10,"svg",6),r._UZ(11,"path",10),r.qZA(),r.qZA(),r.qZA(),r.qZA(),r.qZA()),2&t&&(r.xp6(2),r.Q6J("ngIf",!e.hidePageSize),r.xp6(2),r.Q6J("ngIf","pageNumber"===e.paginator.kind),r.xp6(1),r.Q6J("matTooltip",e._intl.previousPageLabel)("matTooltipPosition","above")("disabled",!e.paginator.hasPrev()),r.uIk("aria-label",e._intl.previousPageLabel),r.xp6(3),r.Q6J("ngIf",!e.hideRangeSelect&&"pageNumber"===e.paginator.kind&&e.pageSizes.length>=1),r.xp6(1),r.Q6J("matTooltip",e._intl.nextPageLabel)("matTooltipPosition","above")("disabled",!e.paginator.hasNext()),r.uIk("aria-label",e._intl.nextPageLabel))},directives:[l.O5,h.lW,d.gM,c.KE,p.gD,l.sg,u.ey],styles:[".mat-paginator-range-label{flex-grow:1}.mat-paginator-container{box-sizing:border-box}"],encapsulation:2,changeDetection:0}),t})()},77902:(t,e,i)=>{"use strict";i.d(e,{n:()=>n});var s=i(90611),a=i(31572);let n=(()=>{class t{constructor(t,e){this.elRef=t,this.ngZone=e}ngAfterViewInit(){const t=()=>{const t=this.context;t.editing&&!t.rowContext.outOfView&&this.elRef.nativeElement.focus()};this.ngZone.runOutsideAngular(()=>{Promise.resolve().then(()=>{if(!this._destroyed){const{viewport:e}=this.context.grid;e&&e.isScrolling?e.scrolling.pipe((0,s.q)(1)).subscribe(t):t()}})})}ngOnDestroy(){this._destroyed=!0}}return t.\u0275fac=function(e){return new(e||t)(a.Y36(a.SBq),a.Y36(a.R0b))},t.\u0275dir=a.lG2({type:t,selectors:[["","pblCellEditAutoFocus",""]],inputs:{context:["pblCellEditAutoFocus","context"]}}),t})()},36703:(t,e,i)=>{"use strict";i.d(e,{yc:()=>d});var s=i(39112),a=i(61511),n=i(20531),r=i(7997),o=i(64914),l=i(31572);const h=t=>[t,!0];let d=(()=>{class t{constructor(e){o.q5.onCreatedSafe(t,(t,i)=>{i&&!i.hasPlugin("sticky")&&i.onInit().subscribe(()=>{const i=e.get("stickyPlugin");i&&(i.headers&&(0,s.h7)(t,"header",i.headers.map(h)),i.footers&&(0,s.h7)(t,"footer",i.footers.map(h)),i.columnStart&&(0,s.Yh)(t,"start",i.columnStart.map(h)),i.columnEnd&&(0,s.Yh)(t,"end",i.columnEnd.map(h)))})})}}return t.NGRID_PLUGIN=(0,o.Ic)({id:s.dm},s.w6),t.\u0275fac=function(e){return new(e||t)(l.LFG(r.f8))},t.\u0275mod=l.oAB({type:t}),t.\u0275inj=l.cJS({imports:[[a.ez,n.HT,o.dC]]}),t})()},39112:(t,e,i)=>{"use strict";i.d(e,{dm:()=>r,h7:()=>o,Yh:()=>l,w6:()=>h});var s=i(7997),a=i(64914),n=i(31572);const r="sticky";function o(t,e,i,s){const n="header"===e,r=n?t._headerRowDefs:t._footerRowDefs,o=Array.isArray(i)?i:[[i,s]],l=n&&t.showHeader||!n&&t.showFooter?1:0;let h;for(const[a,d]of o){let t="table"===a?0:a+l;n||(t=r.length-1-t);const e=r.toArray()[t];e&&e.sticky!==d&&(e.sticky=d,h=!0)}if(h){const e=a.q5.find(t).extApi.cdkTable;n?e.updateStickyHeaderRowStyles():e.updateStickyFooterRowStyles()}}function l(t,e,i,s){const n=Array.isArray(i)?i:[[i,s]];let r;for(let[a,o]of n){"string"==typeof a&&(a=t.columnApi.visibleColumns.findIndex(t=>t.orgProp===a));const i=t.columnApi.visibleColumns[a];i&&(r=!0,i.pin=o?e:void 0,"end"===e?(i.columnDef.stickyEnd=o,i.columnDef.sticky=!1):(i.columnDef.sticky=o,i.columnDef.stickyEnd=!1))}r&&a.q5.find(t).extApi.cdkTable.updateStickyColumnStyles()}let h=(()=>{class t{constructor(t,e,i){this.grid=t,this._differs=e,this.pluginCtrl=i,this._columnCache={start:[],end:[]},this.viewInitialized=!1,this._removePlugin=i.setPlugin(r,this),i.events.pipe(s.qL).subscribe(()=>{const t=i.extApi.cdkTable;t.updateStickyHeaderRowStyles(),t.updateStickyColumnStyles(),t.updateStickyFooterRowStyles()}),i.events.pipe(s.aL).subscribe(()=>{this._startDiffer&&this.grid.isInit&&(this._startDiffer.diff([]),this.applyColumnDiff("start",this._columnCache.start,this._startDiffer)),this._endDiffer&&this.grid.isInit&&(this._endDiffer.diff([]),this.applyColumnDiff("end",this._columnCache.end,this._endDiffer))})}set stickyColumnStart(t){this._startDiffer||(this._startDiffer=this._differs.find([]).create()),this.applyColumnDiff("start",t,this._startDiffer)}set stickyColumnEnd(t){this._endDiffer||(this._endDiffer=this._differs.find([]).create()),this.applyColumnDiff("end",t,this._endDiffer)}set stickyHeader(t){this._headerDiffer||(this._headerDiffer=this._differs.find([]).create()),this.applyRowDiff("header",t,this._headerDiffer)}set stickyFooter(t){this._footerDiffer||(this._footerDiffer=this._differs.find([]).create()),this.applyRowDiff("footer",t,this._footerDiffer)}ngAfterViewInit(){this.viewInitialized=!0}ngOnDestroy(){this._removePlugin(this.grid)}applyColumnDiff(t,e,i){if(!this.viewInitialized)return void requestAnimationFrame(()=>this.applyColumnDiff(t,e,i));this._columnCache[t]=e||[];const s=i.diff(e||[]),a=[];s.forEachOperation((t,e,i)=>{null==t.previousIndex?a.push([t.item,!0]):null==i&&a.push([t.item,!1])}),a.length>0&&l(this.grid,t,a)}applyRowDiff(t,e,i){if(!this.grid.isInit)return void this.pluginCtrl.onInit().subscribe(()=>{this.applyRowDiff(t,e,i)});const s=i.diff(e||[]),a=[];s.forEachOperation((t,e,i)=>{null==t.previousIndex?a.push([t.item,!0]):null==i&&a.push([t.item,!1])}),a.length>0&&o(this.grid,t,a)}}return t.\u0275fac=function(e){return new(e||t)(n.Y36(a.eZ),n.Y36(n.ZZ4),n.Y36(a.q5))},t.\u0275dir=n.lG2({type:t,selectors:[["pbl-ngrid","stickyColumnStart",""],["pbl-ngrid","stickyColumnEnd",""],["pbl-ngrid","stickyHeader",""],["pbl-ngrid","stickyFooter",""]],inputs:{stickyColumnStart:"stickyColumnStart",stickyColumnEnd:"stickyColumnEnd",stickyHeader:"stickyHeader",stickyFooter:"stickyFooter"}}),t})()},30986:(t,e,i)=>{"use strict";i.d(e,{L:()=>o});var s=i(4198),a=i(61511),n=i(64914),r=i(31572);let o=(()=>{class t{}return t.NGRID_PLUGIN=(0,n.Ic)({id:s.d},s.f),t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=r.oAB({type:t}),t.\u0275inj=r.cJS({imports:[[a.ez,n.dC]]}),t})()},4198:(t,e,i)=>{"use strict";i.d(e,{d:()=>S,f:()=>_});var s=i(19861),a=i(7997),n=i(64914),r=i(4710),o=i(40878),l=i(19764),h=i(44019),d=i(79996);const c=Symbol("LOCAL_COLUMN_DEF"),p={};class u{constructor(t,e,i,s){this.grid=t,this.pluginCtrl=e,this.updateColumns=i,this.sourceFactoryWrapper=s,this.init(),t.columns&&t.columnApi.visibleColumns.length>0&&this.onInvalidateHeaders(),this.onDataSource(this.grid.ds)}destroy(t){this.destroyed||(this.destroyed=!0,a.dW.kill(this,this.grid),this.grid.showHeader=this.headerRow,this.grid.columns=this.columnsInput,t&&(this.grid.invalidateColumns(),this.grid.ds.refresh(p)))}init(){this.headerRow=this.grid.showHeader,this.grid.showHeader=!1,this.pluginCtrl.events.pipe(a.aL,(0,a.dW)(this,this.grid)).subscribe(t=>this.onInvalidateHeaders()),this.pluginCtrl.events.pipe((0,a.dW)(this,this.grid)).subscribe(t=>"onDataSource"===t.kind&&this.onDataSource(t.curr))}onInvalidateHeaders(){this.grid.columns[c]||(this.columnsInput=this.grid.columns,this.storeColumns=this.grid.columnApi.visibleColumns,this.updateColumns())}onDataSource(t){this.unPatchDataSource(),t&&(this.ds=t,this.dsSourceFactory=t.adapter.sourceFactory,this.ds.adapter.sourceFactory=t=>{const e=t.data.changed&&t.data.curr===p?this.ds.source:this.dsSourceFactory(t);return!1===e?e:this.destroyed?(this.unPatchDataSource(),this.rawSource):((0,r.b)(e)?e:Array.isArray(e)?(0,o.of)(e):(0,l.D)(e)).pipe((0,h.b)(t=>this.rawSource=t),(0,d.U)(this.sourceFactoryWrapper))})}unPatchDataSource(){this.ds&&(this.ds.adapter.sourceFactory=this.dsSourceFactory,this.ds=this.dsSourceFactory=void 0)}}const g=Symbol("TRANSFORM_ROW_REF");function f(t){return(0,a.NA)(t,this.data[g])}function m(t,e){return{prop:`__transform_item_${e}__`,data:{[g]:t}}}var b=i(31572);const y={prop:"__transpose__",css:"pbl-ngrid-header-cell pbl-ngrid-transposed-header-cell"},S="transpose";let _=(()=>{class t{constructor(t,e,i){this.grid=t,this.pluginCtrl=e,this._header=y,this._removePlugin=e.setPlugin(S,this);const s=i.get("transposePlugin");s&&(this.header=s.header,this.defaultCol=s.defaultCol||{},this.matchTemplates=s.matchTemplates||!1),e.onInit().subscribe(()=>{void 0!==this.enabled&&this.updateState(void 0,this.enabled)})}get transpose(){return this.enabled}set transpose(t){(t=(0,s.Ig)(t))!==this.enabled&&this.grid.isInit&&this.updateState(this.enabled,t),this.enabled=t}set header(t){this._header=Object.assign({},y,t||{})}ngOnDestroy(){this._removePlugin(this.grid),this.disable(!1),a.dW.kill(this)}disable(t){if(this.gridState){const{gridState:e}=this;this.columns=this.selfColumn=this.gridState=this.columns=this.selfColumn=void 0,e.destroy(t)}}enable(t=!1){this.gridState&&this.disable(!1),this.gridState=new u(this.grid,this.pluginCtrl,()=>this.updateColumns(this.grid.columnApi.visibleColumns),t=>{if(t){const e=this.grid.columns=(0,n.I7)().default(this.defaultCol||{}).table(this.selfColumn,...t.map(m)).build(),i=this.gridState.columnsInput;e.header=i.header,e.headerGroup=i.headerGroup,e.footer=i.footer,e[c]=!0,this.grid.invalidateColumns();const a=(0,s.Ig)(this.matchTemplates),{prop:r}=this._header,o=["type"];let l;a&&o.push("cellTpl");for(const t of this.grid.columnApi.visibleColumns)if(t.orgProp===r)t.getValue=t=>(l=t,t.label);else{t.getValue=f;for(const e of o)Object.defineProperty(t,e,{configurable:!0,get:()=>l&&l[e],set:t=>{}})}return this.columns}return t}),t?(this.pluginCtrl.extApi.contextApi.clear(),this.grid.ds.refresh()):this.grid.ds.length>0&&this.grid.ds.refresh(p)}updateState(t,e){e?this.enable(!(void 0===t)):this.disable(!0)}updateColumns(t){const{prop:e}=this._header;this.columns=[];for(const i of t)i.orgProp===e?this.selfColumn=i:this.columns.push(i);this.selfColumn||(this.selfColumn=new n.dS(this._header,this.pluginCtrl.extApi.columnStore.groupStore))}}return t.\u0275fac=function(e){return new(e||t)(b.Y36(n.eZ),b.Y36(n.q5),b.Y36(a.f8))},t.\u0275dir=b.lG2({type:t,selectors:[["pbl-ngrid","transpose",""]],inputs:{transpose:"transpose",header:["transposeHeaderCol","header"],defaultCol:["transposeDefaultCol","defaultCol"],matchTemplates:"matchTemplates"}}),t})()}}]);