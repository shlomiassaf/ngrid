(window.webpackJsonp=window.webpackJsonp||[]).push([[73],{V48m:function(e,t,s){"use strict";s.r(t),s.d(t,"SelectionColumnExampleModule",function(){return R});var i=s("mrSG"),l=s("ofXK"),c=s("XEBs"),n=s("bSwM"),o=s("DcT9"),a=s("fXoL"),b=s("P2FH"),r=s("aR4q"),h=s("L3Ad");function d(e,t){if(1&e){const e=a.Zb();a.Yb(0,"label"),a.Yb(1,"input",4),a.jc("input",function(){return a.Fc(e),a.nc(2).masterToggle()}),a.Xb(),a.Xb()}if(2&e){const e=a.nc(2);a.Hb(e.selectionClass),a.Fb(1),a.uc("checked",e.allSelected)}}function u(e,t){if(1&e&&(a.Wb(0),a.Qc(1,d,2,3,"label",3),a.Vb()),2&e){const e=a.nc();a.Fb(1),a.uc("ngIf","none"!==e.bulkSelectMode)}}function p(e,t){if(1&e){const e=a.Zb();a.Yb(0,"label"),a.Yb(1,"input",5),a.jc("input",function(){a.Fc(e);const s=t.row;return a.nc().rowItemChange(s)}),a.Xb(),a.Xb()}if(2&e){const e=t.row,s=a.nc();a.Fb(1),a.Hb(s.selectionClass),a.uc("checked",s.selection.isSelected(e))("disabled",s.isCheckboxDisabled(e))}}function f(e,t){if(1&e&&(a.Yb(0,"span"),a.Sc(1),a.Xb()),2&e){const e=a.nc();a.Fb(1),a.Tc(e.length?e.length:"")}}const m=()=>!1;let g=(()=>{class e{constructor(e,t){this.table=e,this.cdr=t,this.allSelected=!1,this._isCheckboxDisabled=m,c.m.find(e).events.pipe(Object(o.r)(this)).subscribe(e=>{"onDataSource"===e.kind&&(this.selection=e.curr.selection)})}get bulkSelectMode(){return this._bulkSelectMode}set bulkSelectMode(e){e!==this._bulkSelectMode&&(this._bulkSelectMode=e,this.setupSelection())}get selection(){return this._selection}set selection(e){e!==this._selection&&(this._selection=e,this.setupSelection())}get isCheckboxDisabled(){return this._isCheckboxDisabled}set isCheckboxDisabled(e){e!==this._isCheckboxDisabled&&(this._isCheckboxDisabled=e,this._isCheckboxDisabled&&"function"==typeof this._isCheckboxDisabled||(this._isCheckboxDisabled=m))}get selectionClass(){return this._selectionClass}set selectionClass(e){e!==this._selectionClass&&(this._selectionClass=e,this.table.isInit&&this.markAndDetect())}ngAfterViewInit(){!this.selection&&this.table.ds&&(this.selection=this.table.ds.selection);const e=this.table.registry;e.addMulti("headerCell",this.headerDef),e.addMulti("tableCell",this.cellDef),e.addMulti("footerCell",this.footerDef)}ngOnDestroy(){o.r.kill(this)}masterToggle(){if(this.allSelected)this.selection.clear();else{const e=this.getCollection().filter(e=>!this._isCheckboxDisabled(e));this.selection.select(...e)}}rowItemChange(e){this.selection.toggle(e),this.markAndDetect()}onInput(e,t){console.log(e,t)}getCollection(){const{ds:e}=this.table;return"view"===this.bulkSelectMode?e.renderedData:e.source}setupSelection(){o.r.kill(this,this.table),this._selection?(this.length=this.selection.selected.length,this.selection.changed.pipe(Object(o.r)(this,this.table)).subscribe(()=>this.handleSelectionChanged()),("view"===this.bulkSelectMode?this.table.ds.onRenderedDataChanged:this.table.ds.onSourceChanged).pipe(Object(o.r)(this,this.table)).subscribe(()=>this.handleSelectionChanged())):this.length=0}handleSelectionChanged(){const{length:e}=this.getCollection().filter(e=>!this._isCheckboxDisabled(e));this.allSelected=!this.selection.isEmpty()&&this.selection.selected.length===e,this.length=this.selection.selected.length,this.markAndDetect()}markAndDetect(){this.cdr.markForCheck(),this.cdr.detectChanges()}}return e.\u0275fac=function(t){return new(t||e)(a.Sb(c.f),a.Sb(a.h))},e.\u0275cmp=a.Mb({type:e,selectors:[["pbl-ngrid-bs-checkbox"]],viewQuery:function(e,t){if(1&e&&(a.Kc(c.i,!0),a.Kc(c.e,!0),a.Kc(c.h,!0)),2&e){let e;a.Bc(e=a.kc())&&(t.headerDef=e.first),a.Bc(e=a.kc())&&(t.cellDef=e.first),a.Bc(e=a.kc())&&(t.footerDef=e.first)}},inputs:{name:"name",bulkSelectMode:"bulkSelectMode",selection:"selection",isCheckboxDisabled:"isCheckboxDisabled",selectionClass:"selectionClass"},decls:3,vars:3,consts:[[4,"pblNgridHeaderCellDef"],[4,"pblNgridCellDef"],[4,"pblNgridFooterCellDef"],[3,"class",4,"ngIf"],["type","checkbox",3,"checked","input"],["type","checkbox",3,"checked","disabled","input"]],template:function(e,t){1&e&&(a.Qc(0,u,2,1,"ng-container",0),a.Qc(1,p,2,4,"label",1),a.Qc(2,f,2,1,"span",2)),2&e&&(a.uc("pblNgridHeaderCellDef",t.name),a.Fb(1),a.uc("pblNgridCellDef",t.name),a.Fb(1),a.uc("pblNgridFooterCellDef",t.name))},directives:[b.a,r.a,h.a,l.u],styles:[""],encapsulation:2,changeDetection:0}),e})();const k="bsSelectionColumn";let S=(()=>{class e{constructor(e,t,s,i){this.table=e,this.cfr=t,this.injector=s,this._selectionClass="",this._removePlugin=i.setPlugin(k,this)}get isCheckboxDisabled(){return this._isCheckboxDisabled}set isCheckboxDisabled(e){e!==this._isCheckboxDisabled&&(this._isCheckboxDisabled=e,this.cmpRef&&e&&(this.cmpRef.instance.isCheckboxDisabled=e,this.cmpRef.changeDetectorRef.detectChanges()))}get bsSelectionColumn(){return this._name}set bsSelectionColumn(e){e!==this._name&&(this._name=e,e?(this.cmpRef||(this.cmpRef=this.cfr.resolveComponentFactory(g).create(this.injector),this.cmpRef.instance.table=this.table,this._bulkSelectMode&&(this.cmpRef.instance.bulkSelectMode=this._bulkSelectMode),this.cmpRef.instance.selectionClass=this._selectionClass),this.isCheckboxDisabled&&(this.cmpRef.instance.isCheckboxDisabled=this.isCheckboxDisabled),this.cmpRef.instance.name=e,this.cmpRef.changeDetectorRef.detectChanges()):this.cmpRef&&(this.cmpRef.destroy(),this.cmpRef=void 0))}get bulkSelectMode(){return this._bulkSelectMode}set bulkSelectMode(e){e!==this._bulkSelectMode&&(this._bulkSelectMode=e,this.cmpRef&&(this.cmpRef.instance.bulkSelectMode=e))}get bsSelectionClass(){return this._selectionClass}set matCheckboxSelectionColor(e){e!==this._selectionClass&&(this._selectionClass=e,this.cmpRef&&(this.cmpRef.instance.selectionClass=e))}ngOnDestroy(){this.cmpRef&&this.cmpRef.destroy(),this._removePlugin(this.table)}}return e.\u0275fac=function(t){return new(t||e)(a.Sb(c.f),a.Sb(a.j),a.Sb(a.v),a.Sb(c.m))},e.\u0275dir=a.Nb({type:e,selectors:[["pbl-ngrid","bsSelectionColumn",""]],inputs:{isCheckboxDisabled:"isCheckboxDisabled",bsSelectionColumn:"bsSelectionColumn",bulkSelectMode:"bulkSelectMode",bsSelectionClass:"bsSelectionClass"}}),e})(),C=(()=>{class e{}return e.NGRID_PLUGIN=Object(c.u)({id:k},S),e.\u0275mod=a.Qb({type:e}),e.\u0275inj=a.Pb({factory:function(t){return new(t||e)},imports:[[l.c,n.b,c.j]]}),e})();var D=s("YT2F"),x=s("WPM6"),M=s("9Q/P"),_=s("fluT"),w=s("XkVd");let y=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=Object(c.r)().default({minWidth:100}).table({prop:"selection",width:"48px"},{prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=Object(c.s)().onTrigger(()=>this.datasource.getPeople(0,15)).create()}};return e.\u0275fac=function(t){return new(t||e)(a.Sb(_.a))},e.\u0275cmp=a.Mb({type:e,selectors:[["pbl-bs-selection-column-example"]],decls:1,vars:2,consts:[["bsSelectionColumn","selection",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"]],template:function(e,t){1&e&&a.Tb(0,"pbl-ngrid",0),2&e&&a.uc("dataSource",t.ds)("columns",t.columns)},directives:[w.a,S],styles:[""],encapsulation:2,changeDetection:0}),e=Object(i.a)([Object(D.e)("pbl-bs-selection-column-example",{title:"Selection Column"}),Object(i.b)("design:paramtypes",[_.a])],e),e})();var j=s("XiUz");let v=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=Object(c.r)().default({minWidth:100}).table({prop:"selection",width:"48px"},{prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=Object(c.s)().onTrigger(()=>this.datasource.getPeople(0,500)).create(),this.bulkSelectMode="all"}};return e.\u0275fac=function(t){return new(t||e)(a.Sb(_.a))},e.\u0275cmp=a.Mb({type:e,selectors:[["pbl-bs-bulk-mode-and-virtual-scroll-example"]],decls:14,vars:12,consts:[["bsSelectionColumn","selection","showFooter","",1,"pbl-ngrid-cell-ellipsis",3,"bulkSelectMode","dataSource","columns"],["fxLayout","row","fxLayoutAlign","start center","fxLayoutGap","16px",2,"margin","8px 16px"],[1,"btn-group","btn-group-toggle"],[1,"btn","btn-primary"],["type","radio",3,"checked","input"]],template:function(e,t){1&e&&(a.Tb(0,"pbl-ngrid",0),a.Yb(1,"div",1),a.Yb(2,"h3"),a.Sc(3,"Bulk Mode: "),a.Xb(),a.Yb(4,"div",2),a.Yb(5,"label",3),a.Yb(6,"input",4),a.jc("input",function(e){return e.target.checked?t.bulkSelectMode="all":null}),a.Xb(),a.Sc(7," All "),a.Xb(),a.Yb(8,"label",3),a.Yb(9,"input",4),a.jc("input",function(e){return e.target.checked?t.bulkSelectMode="view":null}),a.Xb(),a.Sc(10," View "),a.Xb(),a.Yb(11,"label",3),a.Yb(12,"input",4),a.jc("input",function(e){return e.target.checked?t.bulkSelectMode="none":null}),a.Xb(),a.Sc(13," None "),a.Xb(),a.Xb(),a.Xb()),2&e&&(a.uc("bulkSelectMode",t.bulkSelectMode)("dataSource",t.ds)("columns",t.columns),a.Fb(5),a.Kb("active","all"===t.bulkSelectMode),a.Fb(1),a.uc("checked","all"===t.bulkSelectMode),a.Fb(2),a.Kb("active","view"===t.bulkSelectMode),a.Fb(1),a.uc("checked","view"===t.bulkSelectMode),a.Fb(2),a.Kb("active","none"===t.bulkSelectMode),a.Fb(1),a.uc("checked","none"===t.bulkSelectMode))},directives:[w.a,S,j.f,j.e,j.g],styles:[""],encapsulation:2,changeDetection:0}),e=Object(i.a)([Object(D.e)("pbl-bs-bulk-mode-and-virtual-scroll-example",{title:"Bulk Mode & Virtual Scroll"}),Object(i.b)("design:paramtypes",[_.a])],e),e})(),R=(()=>{let e=class{};return e.\u0275mod=a.Qb({type:e}),e.\u0275inj=a.Pb({factory:function(t){return new(t||e)},imports:[[M.a,l.c,x.a,c.j,C]]}),e=Object(i.a)([Object(D.a)(y,v)],e),e})()}}]);