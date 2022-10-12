"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[6246],{86246:(le,h,l)=>{l.r(h),l.d(h,{InfiniteScrollPerformanceDemoExampleModule:()=>r});var u=l(70655),d=l(36895),P=l(59549),A=l(84385),g=l(87314),f=l(71948),v=l(56709),x=l(51572),m=l(14625),D=l(67513),Z=l(42502),w=l(41689),M=l(21462),E=l(77909),B=l(81929),N=l(12958),y=l(43622),T=l(88562),L=l(27569),b=l(47528),e=l(94650),p=l(50841),C=l(1576),Q=l(94293),J=l(73006),U=l(91665),O=l(32445),R=l(81134),Y=l(96614),j=l(37048),G=l(24329),F=l(84820),H=l(33168),z=l(96308),V=l(68011),$=l(18304),X=l(92402);function K(n,o){if(1&n){const t=e.EpF();e.TgZ(0,"mat-slider",10),e.NdJ("change",function(s){e.CHM(t);const te=e.oxw();return e.KtG(te.wheelMode=s.value)}),e.qZA()}if(2&n){const t=e.oxw();e.Q6J("value",t.wheelMode)}}function W(n,o){if(1&n&&(e.TgZ(0,"div",17),e._uU(1),e.ALo(2,"currency"),e.qZA()),2&n){const t=o.value,a=o.col,s=o.row;e.Q6J("ngridCellClass",t<0?a.type.data.pbl:a.type.data.pos),e.xp6(1),e.Oqu(e.gM2(2,2,t,a.type.data.meta.currency(s),"symbol",a.type.data.format))}}function k(n,o){if(1&n&&(e.TgZ(0,"div"),e._uU(1),e.qZA()),2&n){const t=o.col,a=o.row;e.xp6(1),e.Oqu(t.type.data.flagAndCountry(a))}}function q(n,o){if(1&n&&(e.TgZ(0,"div"),e._uU(1),e.ALo(2,"number"),e.ALo(3,"number"),e.ALo(4,"number"),e.qZA()),2&n){const t=e.oxw(2);e.xp6(1),e.lnq(" Showing ",e.lcZ(2,3,t.ds.renderStart)," to ",e.lcZ(3,5,t.ds.renderStart+t.ds.renderLength)," out of ",e.lcZ(4,7,t.ds.length),"")}}function _(n,o){1&n&&(e.TgZ(0,"pbl-ngrid-row",18),e._UZ(1,"mat-spinner",19),e.qZA())}function ee(n,o){if(1&n&&(e.TgZ(0,"pbl-ngrid",11),e._UZ(1,"pbl-demo-action-row",12),e.YNc(2,W,3,7,"div",13),e.YNc(3,k,2,1,"div",14),e.YNc(4,q,5,9,"div",15),e.YNc(5,_,2,0,"pbl-ngrid-row",16),e.qZA()),2&n){const t=e.oxw();e.Q6J("dataSource",t.ds)("columns",t.columns)("wheelMode",t.wheelMode)("hideColumns",t.hideColumns),e.xp6(2),e.Q6J("pblNgridCellTypeDef","accountBalance"),e.xp6(1),e.Q6J("pblNgridCellTypeDef","flagAndCountry"),e.xp6(1),e.Q6J("pblNgridFooterCellDef","footerPageInfo")}}const i={currency:n=>i.data.countries[n.country]?.currencies[0],flagAndCountry:n=>i.flag(n)+" "+i.name(n),name:n=>i.data.countries[n.country]?.name,flag:n=>i.data.countries[n.country]?.emoji,data:void 0},I={name:"accountBalance",data:{pbl:"balance-negative",pos:"balance-positive",format:"1.0-2",meta:i}};function S(n=!1){const o=t=>n?void 0:t;return(0,m.I7)().default({minWidth:100,resize:!0}).table({prop:"id",pIndex:!0,width:"40px"},{prop:"name",sort:!0,reorder:!0},{prop:"country",headerType:o("country"),type:o({name:"flagAndCountry",data:i}),width:"150px"},{prop:"jobTitle"},{prop:"accountId"},{prop:"accountType",reorder:!0},{prop:"primeAccount",type:o("visualBool"),width:"24px"},{prop:"creditScore",type:o("starRatings"),width:"50px"},{prop:"balance",type:o(I),sort:!0},...Array.from(new Array(12)).map((t,a)=>({prop:`monthlyBalance.${a}`,type:o(I),sort:!0}))).headerGroup({label:"Customer Info",columnIds:["name","country","jobTitle"]},{label:"Account Info",columnIds:["accountId","accountType","primeAccount","creditScore","balance"]},{label:"Monthly Balance",columnIds:Array.from(new Array(12)).map((t,a)=>`monthlyBalance.${a}`)}).footer({id:"footerPageInfo"}).footer({id:"rere123f",label:"FOOTER2"}).build()}let c=class{constructor(o,t,a){this.datasource=o,this.client=t,this.cdr=a,this.columns=S(),this.ds=this.getDatasource(),this.wheelMode="passive",this.wheelModeState="passive",this.plainColumns=!1,this.showTable=!0,this.hideColumns=[]}toggleColumn(o,t){const a=o.indexOf(t);-1===a?o.push(t):o.splice(a,1)}togglePlainColumns(){this.plainColumns=!this.plainColumns,this.showTable=!1,setTimeout(()=>{this.showTable=!0,this.columns=S(this.plainColumns),this.ds=this.getDatasource(),this.cdr.detectChanges()},100)}wheelModeChange(o){switch(this.wheelModeState=o.value,this.wheelModeState){case"passive":case"blocking":this.wheelMode=this.wheelModeState;break;default:this.wheelMode=15}}getDatasource(){return(0,y.R6)().withInfiniteScrollOptions({blockSize:100,initialVirtualSize:100}).withCacheOptions("sequenceBlocks").onTrigger(o=>{if(o.isInitial)return this.datasource.getCountries().then(t=>i.data=t).then(()=>this.client.getCustomers({pagination:{itemsPerPage:100,page:1}})).then(t=>(console.log("Init Infinite Request!"),this.ds.updateVirtualSize(3e6),o.updateTotalLength(3e6),t.items));{const t=Math.floor(o.fromRow/100)+1;return console.log(`Infinite Request - Page: ${t} | Items: 100 `),this.client.getCustomers({pagination:{itemsPerPage:100,page:1}}).then(a=>a.items.map(s=>Object.assign(Object.create(s),{id:s.id+100*(t-1)})))}}).create()}};c.\u0275fac=function(o){return new(o||c)(e.Y36(p.BQ),e.Y36(p.eX),e.Y36(e.sBO))},c.\u0275cmp=e.Xpm({type:c,selectors:[["pbl-infinite-scroll-performance-demo-example"]],viewQuery:function(o,t){if(1&o&&e.Gf(m.eZ,5),2&o){let a;e.iGM(a=e.CRH())&&(t.pblTable=a.first)}},decls:14,vars:6,consts:[["fxLayout","column","fxLayoutGap","16px",1,"pbl-fill-absolute"],["fxLayout","row","fxLayoutGap","16px",2,"width","100%"],["fxLayout","row","fxLayoutGap","8px",3,"value","disabled","change"],["value","passive"],["value","blocking"],["value","threshold"],["thumbLabel","","min","1","max","55",3,"value","change",4,"ngIf"],[3,"checked","change"],[2,"flex","1 1 100%","display","flex","min-height","0px"],["class","pbl-ngrid-cell-ellipsis pbl-ngrid-header-cell-ellipsis","style","height: 100%; width: 100%;","vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","columnReorder","","blockUi","","matSort","","cellTooltip","",3,"dataSource","columns","wheelMode","hideColumns",4,"ngIf"],["thumbLabel","","min","1","max","55",3,"value","change"],["vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","columnReorder","","blockUi","","matSort","","cellTooltip","",1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",2,"height","100%","width","100%",3,"dataSource","columns","wheelMode","hideColumns"],["label","Infinite Scroll Performance","showFps",""],[3,"ngridCellClass",4,"pblNgridCellTypeDef"],[4,"pblNgridCellTypeDef"],[4,"pblNgridFooterCellDef"],["in","","class","pbl-ngrid-infinite-virtual-row","infiniteRow","",4,"pblNgridInfiniteVirtualRowDef"],[3,"ngridCellClass"],["in","","infiniteRow","",1,"pbl-ngrid-infinite-virtual-row"],["diameter","24"]],template:function(o,t){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"mat-radio-group",2),e.NdJ("change",function(s){return t.wheelModeChange(s)}),e.TgZ(3,"mat-radio-button",3),e._uU(4,"Passive"),e.qZA(),e.TgZ(5,"mat-radio-button",4),e._uU(6,"Blocking"),e.qZA(),e.TgZ(7,"mat-radio-button",5),e._uU(8),e.qZA()(),e.YNc(9,K,1,1,"mat-slider",6),e.qZA(),e.TgZ(10,"mat-checkbox",7),e.NdJ("change",function(){return t.togglePlainColumns()}),e._uU(11,"Use plain columns (higher frame rate)"),e.qZA(),e.TgZ(12,"div",8),e.YNc(13,ee,6,7,"pbl-ngrid",9),e.qZA()()),2&o&&(e.xp6(2),e.Q6J("value",t.wheelModeState)("disabled",null==t.pblTable?null:t.pblTable.virtualPagingActive),e.xp6(6),e.hij("Threshold","threshold"===t.wheelModeState?" ("+t.wheelMode+")":"",""),e.xp6(1),e.Q6J("ngIf","threshold"===t.wheelModeState),e.xp6(1),e.Q6J("checked",t.plainColumns),e.xp6(3),e.Q6J("ngIf",t.showTable))},dependencies:[d.O5,g.pH,f.VQ,f.U0,v.oG,x.Ou,C.xw,C.SQ,Q.R,J.e,U.T,O.I,R.$,Y.B,j.eZ,G.I,F.C,H.u,z.YE,V.k,$.a,X.h,d.JJ,d.H9],styles:[".balance-negative{background:rgba(255,0,0,.33)}.balance-positive{background:rgba(0,128,0,.33)}\n"],encapsulation:2,changeDetection:0}),c=(0,u.gn)([(0,T.en)("pbl-infinite-scroll-performance-demo-example",{title:"Infinite Scroll Performance Demo"}),(0,u.w6)("design:paramtypes",[p.BQ,p.eX,e.sBO])],c),l(55818),l(63720);let r=class{};r.\u0275fac=function(o){return new(o||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({providers:[m.B6],imports:[d.ez,P.lN,A.LD,g.KP,f.Fk,v.p9,x.Cq,L.a,b.Q,m.dC.withCommon([{component:b.a}]),D.Ij.withDefaultTemplates(),Z.sx,w.sj,M.Lu,E.d,B.y,N.UY,y.a5]}),r=(0,u.gn)([(0,T.qB)(c)],r)}}]);