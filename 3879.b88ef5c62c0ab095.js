"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[3879],{27569:(_,f,t)=>{t.d(f,{a:()=>m});var d=t(77093),g=t(23322),u=t(88562),a=t(5e3);let m=(()=>{class s{}return s.\u0275fac=function(h){return new(h||s)},s.\u0275mod=a.oAB({type:s}),s.\u0275inj=a.cJS({imports:[d.ae,g.aT,u.RF,d.ae,g.aT,u.RF]}),s})()},83879:(_,f,t)=>{t.r(f),t.d(f,{PaginationExampleModule:()=>v});var d=t(70655),g=t(69808),u=t(47423),a=t(14625),m=t(41689),s=t(59585),r=t(88562),h=t(27569),P=t(50841),e=t(5e3),p=t(601),E=t(13719),U=t(37048),k=t(84820),A=t(78321);function N(o,i){if(1&o&&e._UZ(0,"pbl-ngrid-paginator",2),2&o){const n=i.$implicit;e.Q6J("grid",n)("paginator",n.ds.paginator)}}let y=class{constructor(i){this.datasource=i,this.columns=(0,a.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(1e3,5e3)).create()}};y.\u0275fac=function(i){return new(i||y)(e.Y36(P.BQ))},y.\u0275cmp=e.Xpm({type:y,selectors:[["pbl-pagination-example"]],decls:2,vars:2,consts:[["usePagination","","blockUi","","vScrollNone","",3,"dataSource","columns"],[3,"grid","paginator",4,"pblNgridPaginatorRef"],[3,"grid","paginator"]],template:function(i,n){1&i&&(e.TgZ(0,"pbl-ngrid",0),e.YNc(1,N,1,2,"pbl-ngrid-paginator",1),e.qZA()),2&i&&e.Q6J("dataSource",n.ds)("columns",n.columns)},dependencies:[p.Y,E.U,U.eZ,k.C,A.Z],encapsulation:2,changeDetection:0}),y=(0,d.gn)([(0,r.en)("pbl-pagination-example",{title:"Client Side Pagination"}),(0,d.w6)("design:paramtypes",[P.BQ])],y);var C=t(5254),x=t(24850);function I(o,i){if(1&o&&e._UZ(0,"pbl-ngrid-paginator",2),2&o){const n=i.$implicit;e.Q6J("grid",n)("paginator",n.ds.paginator)}}let D=class{constructor(i){this.datasource=i,this.columns=(0,a.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=(0,a.AV)().onTrigger(n=>{const{page:l,perPage:c}=this.ds.paginator;return function R(o,i,n){return(0,C.D)(o.getPeople(500,5e3)).pipe((0,x.U)(l=>{const c=(i-1)*n,b=Math.min(l.length,c+n);return{total:l.length,data:l.slice(c,b)}}))}(this.datasource,l,c).pipe((0,x.U)(b=>(n.updateTotalLength(b.total),b.data)))}).setCustomTriggers("pagination").create()}};function O(o,i){if(1&o&&e._UZ(0,"pbl-ngrid-paginator",2),2&o){const n=i.$implicit;e.Q6J("grid",n)("paginator",n.ds.paginator)}}function M(o,i,n){return(0,C.D)(o.getPeople(500,5e3)).pipe((0,x.U)(l=>{const c=(i-1)*n,b=Math.min(l.length,c+n);return{total:l.length,data:l.slice(c,b)}}))}D.\u0275fac=function(i){return new(i||D)(e.Y36(P.BQ))},D.\u0275cmp=e.Xpm({type:D,selectors:[["pbl-async-page-number-example"]],decls:2,vars:2,consts:[["usePagination","","blockUi","",3,"dataSource","columns"],[3,"grid","paginator",4,"pblNgridPaginatorRef"],[3,"grid","paginator"]],template:function(i,n){1&i&&(e.TgZ(0,"pbl-ngrid",0),e.YNc(1,I,1,2,"pbl-ngrid-paginator",1),e.qZA()),2&i&&e.Q6J("dataSource",n.ds)("columns",n.columns)},dependencies:[p.Y,U.eZ,k.C,A.Z],encapsulation:2,changeDetection:0}),D=(0,d.gn)([(0,r.en)("pbl-async-page-number-example",{title:"Async: Page Number"}),(0,d.w6)("design:paramtypes",[P.BQ])],D);let T=class{constructor(i){this.datasource=i,this.columns=(0,a.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=(0,a.AV)().onTrigger(n=>{const{pagination:l}=n;let c;l.page.changed&&(c=l.page.curr),c||this.ds.paginator.reset();const{perPage:b}=this.ds.paginator;return function S(o,i){const n=(l,c)=>btoa(JSON.stringify({page:l,perPage:c}));if("string"==typeof i){const l=JSON.parse(atob(i)),{page:c,perPage:b}=l;return M(o,c,b).pipe((0,x.U)(B=>({token:n(c+1,b),data:B.data})))}{const l=n(2,i);return M(o,1,i).pipe((0,x.U)(c=>({token:l,data:c.data})))}}(this.datasource,c||b).pipe((0,x.U)(B=>(B.token&&this.ds.paginator.addNext(B.token),n.updateTotalLength(B.data.length),B.data)))}).setCustomTriggers("pagination").create()}};T.\u0275fac=function(i){return new(i||T)(e.Y36(P.BQ))},T.\u0275cmp=e.Xpm({type:T,selectors:[["pbl-async-token-example"]],decls:2,vars:2,consts:[["usePagination","token","blockUi","",3,"dataSource","columns"],[3,"grid","paginator",4,"pblNgridPaginatorRef"],[3,"grid","paginator"]],template:function(i,n){1&i&&(e.TgZ(0,"pbl-ngrid",0),e.YNc(1,O,1,2,"pbl-ngrid-paginator",1),e.qZA()),2&i&&e.Q6J("dataSource",n.ds)("columns",n.columns)},dependencies:[p.Y,U.eZ,k.C,A.Z],encapsulation:2,changeDetection:0}),T=(0,d.gn)([(0,r.en)("pbl-async-token-example",{title:"Async: Token"}),(0,d.w6)("design:paramtypes",[P.BQ])],T);let v=class{};v.\u0275fac=function(i){return new(i||v)},v.\u0275mod=e.oAB({type:v}),v.\u0275inj=e.cJS({imports:[g.ez,u.ot,h.a,a.dC,m.sj,s.J]}),v=(0,d.gn)([(0,r.qB)(y,D,T)],v)},41689:(_,f,t)=>{t.d(f,{sj:()=>r}),t(72035);var g=t(84820),u=t(69808),a=t(47796),m=t(14625),s=t(5e3);class r{}r.NGRID_PLUGIN=(0,m.Ic)({id:g.d},g.C),r.\u0275fac=function(P){return new(P||r)},r.\u0275mod=s.oAB({type:r}),r.\u0275inj=s.cJS({imports:[u.ez,a.HT,m.dC]})},84820:(_,f,t)=>{t.d(f,{C:()=>r,d:()=>s});var d=t(54715),g=t(63191),u=t(3805),a=t(14625),m=t(5e3);const s="blockUi";let r=(()=>{class h{constructor(e,p){this.grid=e,this._blockInProgress=!1,this._removePlugin=p.setPlugin(s,this),e.registry.changes.subscribe(E=>{for(const U of E)"blocker"===U.type&&this.setupBlocker()}),p.onInit().subscribe(E=>{E&&this._blockUi&&"boolean"==typeof this._blockUi&&this.setupBlocker()}),p.events.subscribe(E=>{if("onDataSource"===E.kind){const{prev:U,curr:k}=E;U&&u.dW.kill(this,U),k.onSourceChanging.pipe((0,u.dW)(this,k)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!0,this.setupBlocker())}),k.onSourceChanged.pipe((0,u.dW)(this,k)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!1,this.setupBlocker())})}})}get blockUi(){return this._blockUi}set blockUi(e){let p=(0,g.Ig)(e);p&&("auto"===e||""===e)&&(p="auto"),(0,d.b)(e)&&this._blockUi!==e?((0,d.b)(this._blockUi)&&u.dW.kill(this,this._blockUi),this._blockUi=e,e.pipe((0,u.dW)(this,this._blockUi)).subscribe(E=>{this._blockInProgress=E,this.setupBlocker()})):this._blockUi!==p&&(this._blockUi=p,"auto"!==p&&(this._blockInProgress=p,this.setupBlocker()))}ngOnDestroy(){u.dW.kill(this),this._removePlugin(this.grid)}setupBlocker(){if(this.grid.isInit)if(this._blockInProgress){if(!this._blockerEmbeddedVRef){const p=this.grid.registry.getSingle("blocker");p&&(this._blockerEmbeddedVRef=this.grid.createView("afterContent",p.tRef,{$implicit:this.grid}),this._blockerEmbeddedVRef.detectChanges())}}else this._blockerEmbeddedVRef&&(this.grid.removeView(this._blockerEmbeddedVRef,"afterContent"),this._blockerEmbeddedVRef=void 0)}}return h.\u0275fac=function(e){return new(e||h)(m.Y36(a.eZ),m.Y36(a.q5))},h.\u0275dir=m.lG2({type:h,selectors:[["pbl-ngrid","blockUi",""]],inputs:{blockUi:"blockUi"},exportAs:["blockUi"]}),h})()},72035:(_,f,t)=>{t.d(f,{r:()=>u});var d=t(14625),g=t(5e3);let u=(()=>{class a extends d.iT{constructor(s,r){super(s,r),this.kind="blocker"}}return a.\u0275fac=function(s){return new(s||a)(g.Y36(g.Rgc),g.Y36(d.B6))},a.\u0275dir=g.lG2({type:a,selectors:[["","pblNgridBlockUiDef",""]],features:[g.qOj]}),a})()}}]);