(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[6469],{76469:(e,t,a)=>{"use strict";a.r(t),a.d(t,{PaginationExampleModule:()=>k});var i=a(64762),n=a(64914),s=a(61511),r=a(14460),g=a(31572);let o=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=g.oAB({type:e}),e.\u0275inj=g.cJS({imports:[[s.ez,r.jF,n.dC],r.jF]}),e})();var p=a(19861),c=a(7997);function l(e,t){if(1&e&&(g.TgZ(0,"option",10),g._uU(1),g.qZA()),2&e){const e=t.$implicit,a=g.oxw(3);g.Q6J("value",e)("selected",e==a.paginator.perPage),g.xp6(1),g.hij(" ",e," ")}}function d(e,t){if(1&e){const e=g.EpF();g.TgZ(0,"select",7,8),g.NdJ("change",function(){g.CHM(e);const t=g.MAs(1);return g.oxw(2)._perPageChanged(t.value)}),g.YNc(2,l,2,3,"option",9),g.qZA()}if(2&e){const e=g.oxw(2);g.Q6J("value",e.paginator.perPage)("disabled",e.pageSizes[0]>=e.paginator.total&&!e.paginator.hasPrev()&&!e.paginator.hasNext()),g.xp6(2),g.Q6J("ngForOf",e.pageSizes)}}function h(e,t){if(1&e&&(g.TgZ(0,"div"),g._uU(1),g.qZA()),2&e){const e=g.oxw(2);g.xp6(1),g.Oqu(null==e.paginator?null:e.paginator.perPage)}}function u(e,t){if(1&e&&(g.TgZ(0,"div",3),g.TgZ(1,"label",4),g._uU(2,"Item's per page"),g.qZA(),g.YNc(3,d,3,3,"select",5),g.YNc(4,h,2,1,"div",6),g.qZA()),2&e){const e=g.oxw();g.xp6(3),g.Q6J("ngIf",e.pageSizes.length>1),g.xp6(1),g.Q6J("ngIf",e.pageSizes.length<=1)}}const m=[5,10,20,50,100];let b=(()=>{class e{constructor(e,t){this.cdr=t,this.pages=[],this.pageSizes=m.slice(),this._hidePageSize=!1,this._hideRangeSelect=!1,e&&(this.grid=e)}get pageSizeOptions(){return this._pageSizeOptions}set pageSizeOptions(e){this._pageSizeOptions=e,this.pageSizes=(e||m).slice(),this.updatePageSizes()}get paginator(){return this._paginator}set paginator(e){this._paginator!==e&&(this._paginator&&c.dW.kill(this,this._paginator),this._paginator=e,e&&(e.onChange.pipe((0,c.dW)(this,e)).subscribe(e=>this.handlePageChange(e)),this.updatePageSizes()))}get hidePageSize(){return this._hidePageSize}set hidePageSize(e){this._hidePageSize=(0,p.Ig)(e)}get hideRangeSelect(){return this._hideRangeSelect}set hideRangeSelect(e){this._hideRangeSelect=(0,p.Ig)(e)}ngOnDestroy(){c.dW.kill(this)}_pageChanged(e){this.paginator.page=e}_perPageChanged(e){const t=parseInt(e,10);this.paginator.perPage=t}updatePageSizes(){this.paginator&&-1===this.pageSizes.indexOf(this.paginator.perPage)&&this.pageSizes.push(this.paginator.perPage),this.pageSizes.sort((e,t)=>e-t)}handlePageChange(e){if(this.pages.length!==this.paginator.totalPages){const e=this.pages=[];for(let t=1,a=this.paginator.totalPages+1;t<a;t++)e.push(t)}this.cdr.detectChanges(),this.cdr.markForCheck()}}return e.\u0275fac=function(t){return new(t||e)(g.Y36(n.eZ,8),g.Y36(g.sBO))},e.\u0275cmp=g.Xpm({type:e,selectors:[["pbl-ngrid-bs-pagination"]],inputs:{pageSizeOptions:"pageSizeOptions",paginator:"paginator",grid:"grid",hidePageSize:"hidePageSize",hideRangeSelect:"hideRangeSelect"},decls:3,vars:7,consts:[[1,"d-flex","align-items-center","justify-content-end","p-2"],["class","mr-4",4,"ngIf"],[1,"d-flex","align-items-center","justify-content-end",3,"collectionSize","page","pageSize","maxSize","rotate","boundaryLinks","pageChange"],[1,"mr-4"],["for","selectPerPage",1,"mr-2"],["id","selectPerPage","class","custom-select","style","width: auto",3,"value","disabled","change",4,"ngIf"],[4,"ngIf"],["id","selectPerPage",1,"custom-select",2,"width","auto",3,"value","disabled","change"],["selectPerPage",""],[3,"value","selected",4,"ngFor","ngForOf"],[3,"value","selected"]],template:function(e,t){1&e&&(g.TgZ(0,"div",0),g.YNc(1,u,5,2,"div",1),g.TgZ(2,"ngb-pagination",2),g.NdJ("pageChange",function(e){return t._pageChanged(e)}),g.qZA(),g.qZA()),2&e&&(g.xp6(1),g.Q6J("ngIf",!t.hidePageSize),g.xp6(1),g.Q6J("collectionSize",t.paginator.total)("page",t.paginator.page)("pageSize",t.paginator.perPage)("maxSize",5)("rotate",!0)("boundaryLinks",!0))},directives:[s.O5,r.N9,s.sg],styles:[".custom-select{transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;display:inline-block;width:100%;height:calc(1.5em + .75rem + 2px);padding:.375rem 1.75rem .375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;vertical-align:middle;background:#fff url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e\") no-repeat right .75rem center/8px 10px;border:1px solid #ced4da;border-radius:.25rem;-webkit-appearance:none;appearance:none}"],encapsulation:2,changeDetection:0}),e})();var f=a(91668),S=a(70946),P=a(5553),x=a(46418),w=a(88853),z=a(39732);function v(e,t){if(1&e&&g._UZ(0,"pbl-ngrid-bs-pagination",2),2&e){const e=t.$implicit;g.Q6J("grid",e)("paginator",e.ds.paginator)}}let y=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=(0,n.I7)().table({prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=(0,n.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};return e.\u0275fac=function(t){return new(t||e)(g.Y36(x.BQ))},e.\u0275cmp=g.Xpm({type:e,selectors:[["pbl-bs-pagination-example"]],decls:2,vars:2,consts:[["usePagination","",3,"dataSource","columns"],[3,"grid","paginator",4,"pblNgridPaginatorRef"],[3,"grid","paginator"]],template:function(e,t){1&e&&(g.TgZ(0,"pbl-ngrid",0),g.YNc(1,v,1,2,"pbl-ngrid-bs-pagination",1),g.qZA()),2&e&&g.Q6J("dataSource",t.ds)("columns",t.columns)},directives:[w.eZ,z.Y,b],styles:[""],encapsulation:2,changeDetection:0}),e=(0,i.gn)([(0,f.en)("pbl-bs-pagination-example",{title:"Client Side Pagination"}),(0,i.w6)("design:paramtypes",[x.BQ])],e),e})();function Z(e,t){if(1&e&&g._UZ(0,"pbl-ngrid-bs-pagination",2),2&e){const e=t.$implicit;g.Q6J("grid",e)("paginator",e.ds.paginator)}}let _=(()=>{let e=class{constructor(e){this.client=e,this.columns=(0,n.I7)().table({prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=(0,n.AV)().setCustomTriggers("pagination").onTrigger(e=>{var t,a;const i=null!==(t=e.pagination.perPage.curr)&&void 0!==t?t:50,n=null!==(a=e.pagination.page.curr)&&void 0!==a?a:1;return this.client.getPeople({pagination:{itemsPerPage:i,page:n}}).then(t=>(e.updateTotalLength(t.pagination.totalItems),t.items))}).create()}};return e.\u0275fac=function(t){return new(t||e)(g.Y36(x.eX))},e.\u0275cmp=g.Xpm({type:e,selectors:[["pbl-bs-async-page-number-example"]],decls:2,vars:2,consts:[["usePagination","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"],[3,"grid","paginator",4,"pblNgridPaginatorRef"],[3,"grid","paginator"]],template:function(e,t){1&e&&(g.TgZ(0,"pbl-ngrid",0),g.YNc(1,Z,1,2,"pbl-ngrid-bs-pagination",1),g.qZA()),2&e&&g.Q6J("dataSource",t.ds)("columns",t.columns)},directives:[w.eZ,z.Y,b],styles:[""],encapsulation:2,changeDetection:0}),e=(0,i.gn)([(0,f.en)("pbl-bs-async-page-number-example",{title:"Async: Page Number"}),(0,i.w6)("design:paramtypes",[x.eX])],e),e})(),C=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=(0,n.I7)().table({prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=(0,n.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};return e.\u0275fac=function(t){return new(t||e)(g.Y36(x.BQ))},e.\u0275cmp=g.Xpm({type:e,selectors:[["pbl-bs-async-token-example"]],decls:1,vars:2,consts:[[3,"dataSource","columns"]],template:function(e,t){1&e&&g._UZ(0,"pbl-ngrid",0),2&e&&g.Q6J("dataSource",t.ds)("columns",t.columns)},directives:[w.eZ],styles:[""],encapsulation:2,changeDetection:0}),e=(0,i.gn)([(0,f.en)("pbl-bs-async-token-example",{title:"Async: Token"}),(0,i.w6)("design:paramtypes",[x.BQ])],e),e})(),k=(()=>{let e=class{};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=g.oAB({type:e}),e.\u0275inj=g.cJS({imports:[[P.y,S.a,n.dC,o]]}),e=(0,i.gn)([(0,f.qB)(y,_,C)],e),e})()}}]);