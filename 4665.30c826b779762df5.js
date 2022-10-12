"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[4665],{44665:(J,S,s)=>{s.r(S),s.d(S,{PaginationExampleModule:()=>g});var l=s(70655),o=s(14625),P=s(36895),b=s(29231),e=s(94650);let N=(()=>{class t{}return t.\u0275fac=function(a){return new(a||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[P.ez,b.jF,o.dC,b.jF]}),t})();var y=s(21281),f=s(3805);function T(t,i){if(1&t&&(e.TgZ(0,"option",10),e._uU(1),e.qZA()),2&t){const a=i.$implicit,n=e.oxw(3);e.Q6J("value",a)("selected",a==n.paginator.perPage),e.xp6(1),e.hij(" ",a," ")}}function A(t,i){if(1&t){const a=e.EpF();e.TgZ(0,"select",7,8),e.NdJ("change",function(){e.CHM(a);const p=e.MAs(1),r=e.oxw(2);return e.KtG(r._perPageChanged(p.value))}),e.YNc(2,T,2,3,"option",9),e.qZA()}if(2&t){const a=e.oxw(2);e.Q6J("value",a.paginator.perPage)("disabled",a.pageSizes[0]>=a.paginator.total&&!a.paginator.hasPrev()&&!a.paginator.hasNext()),e.xp6(2),e.Q6J("ngForOf",a.pageSizes)}}function Z(t,i){if(1&t&&(e.TgZ(0,"div"),e._uU(1),e.qZA()),2&t){const a=e.oxw(2);e.xp6(1),e.Oqu(null==a.paginator?null:a.paginator.perPage)}}function w(t,i){if(1&t&&(e.TgZ(0,"div",3)(1,"label",4),e._uU(2,"Item's per page"),e.qZA(),e.YNc(3,A,3,3,"select",5),e.YNc(4,Z,2,1,"div",6),e.qZA()),2&t){const a=e.oxw();e.xp6(3),e.Q6J("ngIf",a.pageSizes.length>1),e.xp6(1),e.Q6J("ngIf",a.pageSizes.length<=1)}}const _=[5,10,20,50,100];let z=(()=>{class t{constructor(a,n){this.cdr=n,this.pages=[],this.pageSizes=_.slice(),this._hidePageSize=!1,this._hideRangeSelect=!1,a&&(this.grid=a)}get pageSizeOptions(){return this._pageSizeOptions}set pageSizeOptions(a){this._pageSizeOptions=a,this.pageSizes=(a||_).slice(),this.updatePageSizes()}get paginator(){return this._paginator}set paginator(a){this._paginator!==a&&(this._paginator&&f.dW.kill(this,this._paginator),this._paginator=a,a&&(a.onChange.pipe((0,f.dW)(this,a)).subscribe(n=>this.handlePageChange(n)),this.updatePageSizes()))}get hidePageSize(){return this._hidePageSize}set hidePageSize(a){this._hidePageSize=(0,y.Ig)(a)}get hideRangeSelect(){return this._hideRangeSelect}set hideRangeSelect(a){this._hideRangeSelect=(0,y.Ig)(a)}ngOnDestroy(){f.dW.kill(this)}_pageChanged(a){this.paginator.page=a}_perPageChanged(a){const n=parseInt(a,10);this.paginator.perPage=n}updatePageSizes(){this.paginator&&-1===this.pageSizes.indexOf(this.paginator.perPage)&&this.pageSizes.push(this.paginator.perPage),this.pageSizes.sort((a,n)=>a-n)}handlePageChange(a){if(this.pages.length!==this.paginator.totalPages){const n=this.pages=[];for(let p=1,r=this.paginator.totalPages+1;p<r;p++)n.push(p)}this.cdr.detectChanges(),this.cdr.markForCheck()}}return t.\u0275fac=function(a){return new(a||t)(e.Y36(o.eZ,8),e.Y36(e.sBO))},t.\u0275cmp=e.Xpm({type:t,selectors:[["pbl-ngrid-bs-pagination"]],inputs:{pageSizeOptions:"pageSizeOptions",paginator:"paginator",grid:"grid",hidePageSize:"hidePageSize",hideRangeSelect:"hideRangeSelect"},decls:3,vars:7,consts:[[1,"d-flex","align-items-center","justify-content-end","p-2"],["class","mr-4",4,"ngIf"],[1,"d-flex","align-items-center","justify-content-end",3,"collectionSize","page","pageSize","maxSize","rotate","boundaryLinks","pageChange"],[1,"mr-4"],["for","selectPerPage",1,"mr-2"],["id","selectPerPage","class","custom-select","style","width: auto",3,"value","disabled","change",4,"ngIf"],[4,"ngIf"],["id","selectPerPage",1,"custom-select",2,"width","auto",3,"value","disabled","change"],["selectPerPage",""],[3,"value","selected",4,"ngFor","ngForOf"],[3,"value","selected"]],template:function(a,n){1&a&&(e.TgZ(0,"div",0),e.YNc(1,w,5,2,"div",1),e.TgZ(2,"ngb-pagination",2),e.NdJ("pageChange",function(r){return n._pageChanged(r)}),e.qZA()()),2&a&&(e.xp6(1),e.Q6J("ngIf",!n.hidePageSize),e.xp6(1),e.Q6J("collectionSize",n.paginator.total)("page",n.paginator.page)("pageSize",n.paginator.perPage)("maxSize",5)("rotate",!0)("boundaryLinks",!0))},dependencies:[P.sg,P.O5,b.N9],styles:[".custom-select{transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}.custom-select{display:inline-block;width:100%;height:calc(1.5em + .75rem + 2px);padding:.375rem 1.75rem .375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;vertical-align:middle;background:#fff url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e\") no-repeat right .75rem center/8px 10px;border:1px solid #ced4da;border-radius:.25rem;-webkit-appearance:none;-moz-appearance:none;appearance:none}\n"],encapsulation:2,changeDetection:0}),t})();var u=s(88562),B=s(27569),E=s(56138),m=s(50841),v=s(601),x=s(37048);function C(t,i){if(1&t&&e._UZ(0,"pbl-ngrid-bs-pagination",2),2&t){const a=i.$implicit;e.Q6J("grid",a)("paginator",a.ds.paginator)}}let c=class{constructor(i){this.datasource=i,this.columns=(0,o.I7)().table({prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=(0,o.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};function I(t,i){if(1&t&&e._UZ(0,"pbl-ngrid-bs-pagination",2),2&t){const a=i.$implicit;e.Q6J("grid",a)("paginator",a.ds.paginator)}}c.\u0275fac=function(i){return new(i||c)(e.Y36(m.BQ))},c.\u0275cmp=e.Xpm({type:c,selectors:[["pbl-bs-pagination-example"]],decls:2,vars:2,consts:[["usePagination","",3,"dataSource","columns"],[3,"grid","paginator",4,"pblNgridPaginatorRef"],[3,"grid","paginator"]],template:function(i,a){1&i&&(e.TgZ(0,"pbl-ngrid",0),e.YNc(1,C,1,2,"pbl-ngrid-bs-pagination",1),e.qZA()),2&i&&e.Q6J("dataSource",a.ds)("columns",a.columns)},dependencies:[v.Y,x.eZ,z],encapsulation:2,changeDetection:0}),c=(0,l.gn)([(0,u.en)("pbl-bs-pagination-example",{title:"Client Side Pagination"}),(0,l.w6)("design:paramtypes",[m.BQ])],c);let d=class{constructor(i){this.client=i,this.columns=(0,o.I7)().table({prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=(0,o.AV)().setCustomTriggers("pagination").onTrigger(a=>this.client.getPeople({pagination:{itemsPerPage:a.pagination.perPage.curr??50,page:a.pagination.page.curr??1}}).then(r=>(a.updateTotalLength(r.pagination.totalItems),r.items))).create()}};d.\u0275fac=function(i){return new(i||d)(e.Y36(m.eX))},d.\u0275cmp=e.Xpm({type:d,selectors:[["pbl-bs-async-page-number-example"]],decls:2,vars:2,consts:[["usePagination","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"],[3,"grid","paginator",4,"pblNgridPaginatorRef"],[3,"grid","paginator"]],template:function(i,a){1&i&&(e.TgZ(0,"pbl-ngrid",0),e.YNc(1,I,1,2,"pbl-ngrid-bs-pagination",1),e.qZA()),2&i&&e.Q6J("dataSource",a.ds)("columns",a.columns)},dependencies:[v.Y,x.eZ,z],encapsulation:2,changeDetection:0}),d=(0,l.gn)([(0,u.en)("pbl-bs-async-page-number-example",{title:"Async: Page Number"}),(0,l.w6)("design:paramtypes",[m.eX])],d);let h=class{constructor(i){this.datasource=i,this.columns=(0,o.I7)().table({prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=(0,o.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};h.\u0275fac=function(i){return new(i||h)(e.Y36(m.BQ))},h.\u0275cmp=e.Xpm({type:h,selectors:[["pbl-bs-async-token-example"]],decls:1,vars:2,consts:[[3,"dataSource","columns"]],template:function(i,a){1&i&&e._UZ(0,"pbl-ngrid",0),2&i&&e.Q6J("dataSource",a.ds)("columns",a.columns)},dependencies:[x.eZ],encapsulation:2,changeDetection:0}),h=(0,l.gn)([(0,u.en)("pbl-bs-async-token-example",{title:"Async: Token"}),(0,l.w6)("design:paramtypes",[m.BQ])],h);let g=class{};g.\u0275fac=function(i){return new(i||g)},g.\u0275mod=e.oAB({type:g}),g.\u0275inj=e.cJS({imports:[E.y,B.a,o.dC,N]}),g=(0,l.gn)([(0,u.qB)(c,d,h)],g)}}]);