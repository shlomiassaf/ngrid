(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[3355],{83355:(e,t,o)=>{"use strict";o.r(t),o.d(t,{InfiniteScrollPerformanceDemoExampleModule:()=>V});var l=o(64762),n=o(61511),a=o(66283),i=o(4786),r=o(46594),s=o(54810),c=o(29236),u=o(67806),d=o(64914),p=o(44903),h=o(39030),m=o(89393),g=o(25207),f=o(97239),b=o(18794),w=o(51467),v=o(67857),y=o(91668),x=o(70946),C=o(68043),T=o(31572),Z=o(46418),A=o(3722),I=o(88853),S=o(2367),M=o(83077),q=o(31486),B=o(20467),k=o(93638),P=o(58623),N=o(21570),J=o(12732),L=o(55992),Q=o(81277),D=o(35156),U=o(10803),R=o(70955);function O(e,t){if(1&e){const e=T.EpF();T.TgZ(0,"mat-slider",10),T.NdJ("change",function(t){return T.CHM(e),T.oxw().wheelMode=t.value}),T.qZA()}if(2&e){const e=T.oxw();T.Q6J("value",e.wheelMode)}}function Y(e,t){if(1&e&&(T.TgZ(0,"div",17),T._uU(1),T.ALo(2,"currency"),T.qZA()),2&e){const e=t.value,o=t.col,l=t.row;T.Q6J("ngridCellClass",e<0?o.type.data.pbl:o.type.data.pos),T.xp6(1),T.Oqu(T.gM2(2,2,e,o.type.data.meta.currency(l),"symbol",o.type.data.format))}}function j(e,t){if(1&e&&(T.TgZ(0,"div"),T._uU(1),T.qZA()),2&e){const e=t.col,o=t.row;T.xp6(1),T.Oqu(e.type.data.flagAndCountry(o))}}function _(e,t){if(1&e&&(T.TgZ(0,"div"),T._uU(1),T.ALo(2,"number"),T.ALo(3,"number"),T.ALo(4,"number"),T.qZA()),2&e){const e=T.oxw(2);T.xp6(1),T.lnq(" Showing ",T.lcZ(2,3,e.ds.renderStart)," to ",T.lcZ(3,5,e.ds.renderStart+e.ds.renderLength)," out of ",T.lcZ(4,7,e.ds.length),"")}}function G(e,t){1&e&&(T.TgZ(0,"pbl-ngrid-row",18),T._UZ(1,"mat-spinner",19),T.qZA())}function F(e,t){if(1&e&&(T.TgZ(0,"pbl-ngrid",11),T._UZ(1,"pbl-demo-action-row",12),T.YNc(2,Y,3,7,"div",13),T.YNc(3,j,2,1,"div",14),T.YNc(4,_,5,9,"div",15),T.YNc(5,G,2,0,"pbl-ngrid-row",16),T.qZA()),2&e){const e=T.oxw();T.Q6J("dataSource",e.ds)("columns",e.columns)("wheelMode",e.wheelMode)("hideColumns",e.hideColumns),T.xp6(2),T.Q6J("pblNgridCellTypeDef","accountBalance"),T.xp6(1),T.Q6J("pblNgridCellTypeDef","flagAndCountry"),T.xp6(1),T.Q6J("pblNgridFooterCellDef","footerPageInfo")}}const H={currency:e=>{var t;return null===(t=H.data.countries[e.country])||void 0===t?void 0:t.currencies[0]},flagAndCountry:e=>H.flag(e)+" "+H.name(e),name:e=>{var t;return null===(t=H.data.countries[e.country])||void 0===t?void 0:t.name},flag:e=>{var t;return null===(t=H.data.countries[e.country])||void 0===t?void 0:t.emoji},data:void 0},z={name:"accountBalance",data:{pbl:"balance-negative",pos:"balance-positive",format:"1.0-2",meta:H}};function $(e=!1){const t=t=>e?void 0:t;return(0,d.I7)().default({minWidth:100,resize:!0}).table({prop:"id",pIndex:!0,width:"40px"},{prop:"name",sort:!0,reorder:!0},{prop:"country",headerType:t("country"),type:t({name:"flagAndCountry",data:H}),width:"150px"},{prop:"jobTitle"},{prop:"accountId"},{prop:"accountType",reorder:!0},{prop:"primeAccount",type:t("visualBool"),width:"24px"},{prop:"creditScore",type:t("starRatings"),width:"50px"},{prop:"balance",type:t(z),sort:!0},...Array.from(new Array(12)).map((e,o)=>({prop:`monthlyBalance.${o}`,type:t(z),sort:!0}))).headerGroup({label:"Customer Info",columnIds:["name","country","jobTitle"]},{label:"Account Info",columnIds:["accountId","accountType","primeAccount","creditScore","balance"]},{label:"Monthly Balance",columnIds:Array.from(new Array(12)).map((e,t)=>`monthlyBalance.${t}`)}).footer({id:"footerPageInfo"}).footer({id:"rere123f",label:"FOOTER2"}).build()}let E=(()=>{let e=class{constructor(e,t,o){this.datasource=e,this.client=t,this.cdr=o,this.columns=$(),this.ds=this.getDatasource(),this.wheelMode="passive",this.wheelModeState="passive",this.plainColumns=!1,this.showTable=!0,this.hideColumns=[]}toggleColumn(e,t){const o=e.indexOf(t);-1===o?e.push(t):e.splice(o,1)}togglePlainColumns(){this.plainColumns=!this.plainColumns,this.showTable=!1,setTimeout(()=>{this.showTable=!0,this.columns=$(this.plainColumns),this.ds=this.getDatasource(),this.cdr.detectChanges()},100)}wheelModeChange(e){switch(this.wheelModeState=e.value,this.wheelModeState){case"passive":case"blocking":this.wheelMode=this.wheelModeState;break;default:this.wheelMode=15}}getDatasource(){return(0,v.R6)().withInfiniteScrollOptions({blockSize:100,initialVirtualSize:100}).withCacheOptions("sequenceBlocks").onTrigger(e=>{if(e.isInitial)return this.datasource.getCountries().then(e=>H.data=e).then(()=>this.client.getCustomers({pagination:{itemsPerPage:100,page:1}})).then(t=>(console.log("Init Infinite Request!"),this.ds.updateVirtualSize(3e6),e.updateTotalLength(3e6),t.items));{const t=Math.floor(e.fromRow/100)+1;return console.log(`Infinite Request - Page: ${t} | Items: 100 `),this.client.getCustomers({pagination:{itemsPerPage:100,page:1}}).then(e=>e.items.map(e=>Object.assign(Object.create(e),{id:e.id+100*(t-1)})))}}).create()}};return e.\u0275fac=function(t){return new(t||e)(T.Y36(Z.BQ),T.Y36(Z.eX),T.Y36(T.sBO))},e.\u0275cmp=T.Xpm({type:e,selectors:[["pbl-infinite-scroll-performance-demo-example"]],viewQuery:function(e,t){if(1&e&&T.Gf(d.eZ,5),2&e){let e;T.iGM(e=T.CRH())&&(t.pblTable=e.first)}},decls:14,vars:6,consts:[["fxLayout","column","fxLayoutGap","16px",1,"pbl-fill-absolute"],["fxLayout","row","fxLayoutGap","16px",2,"width","100%"],["fxLayout","row","fxLayoutGap","8px",3,"value","disabled","change"],["value","passive"],["value","blocking"],["value","threshold"],["thumbLabel","","min","1","max","55",3,"value","change",4,"ngIf"],[3,"checked","change"],[2,"flex","1 1 100%","display","flex","min-height","0px"],["class","pbl-ngrid-cell-ellipsis pbl-ngrid-header-cell-ellipsis","style","height: 100%; width: 100%;","vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","columnReorder","","blockUi","","matSort","","cellTooltip","",3,"dataSource","columns","wheelMode","hideColumns",4,"ngIf"],["thumbLabel","","min","1","max","55",3,"value","change"],["vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","columnReorder","","blockUi","","matSort","","cellTooltip","",1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",2,"height","100%","width","100%",3,"dataSource","columns","wheelMode","hideColumns"],["label","Infinite Scroll Performance","showFps",""],[3,"ngridCellClass",4,"pblNgridCellTypeDef"],[4,"pblNgridCellTypeDef"],[4,"pblNgridFooterCellDef"],["in","","class","pbl-ngrid-infinite-virtual-row","infiniteRow","",4,"pblNgridInfiniteVirtualRowDef"],[3,"ngridCellClass"],["in","","infiniteRow","",1,"pbl-ngrid-infinite-virtual-row"],["diameter","24"]],template:function(e,t){1&e&&(T.TgZ(0,"div",0),T.TgZ(1,"div",1),T.TgZ(2,"mat-radio-group",2),T.NdJ("change",function(e){return t.wheelModeChange(e)}),T.TgZ(3,"mat-radio-button",3),T._uU(4,"Passive"),T.qZA(),T.TgZ(5,"mat-radio-button",4),T._uU(6,"Blocking"),T.qZA(),T.TgZ(7,"mat-radio-button",5),T._uU(8),T.qZA(),T.qZA(),T.YNc(9,O,1,1,"mat-slider",6),T.qZA(),T.TgZ(10,"mat-checkbox",7),T.NdJ("change",function(){return t.togglePlainColumns()}),T._uU(11,"Use plain columns (higher frame rate)"),T.qZA(),T.TgZ(12,"div",8),T.YNc(13,F,6,7,"pbl-ngrid",9),T.qZA(),T.qZA()),2&e&&(T.xp6(2),T.Q6J("value",t.wheelModeState)("disabled",null==t.pblTable?null:t.pblTable.virtualPagingActive),T.xp6(6),T.hij("Threshold","threshold"===t.wheelModeState?" ("+t.wheelMode+")":"",""),T.xp6(1),T.Q6J("ngIf","threshold"===t.wheelModeState),T.xp6(1),T.Q6J("checked",t.plainColumns),T.xp6(3),T.Q6J("ngIf",t.showTable))},directives:[A.xw,A.SQ,s.VQ,s.U0,n.O5,c.oG,r.pH,I.eZ,S.B,M.I,q.C,B.u,k.$,P.YE,N.k,J.R,L.I,Q.T,D.a,U.e,R.h,u.$g],pipes:[n.H9,n.JJ],styles:[".balance-negative{background:rgba(255,0,0,.33)}.balance-positive{background:rgba(0,128,0,.33)}"],encapsulation:2,changeDetection:0}),e=(0,l.gn)([(0,y.en)("pbl-infinite-scroll-performance-demo-example",{title:"Infinite Scroll Performance Demo"}),(0,l.w6)("design:paramtypes",[Z.BQ,Z.eX,T.sBO])],e),e})(),V=(()=>{let e=class{};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=T.oAB({type:e}),e.\u0275inj=T.cJS({providers:[d.B6],imports:[[n.ez,a.lN,i.LD,r.KP,s.Fk,c.p9,u.Cq,x.a,C.Q,d.dC.withCommon([{component:C.a}]),p.Ij.withDefaultTemplates(),h.sx,m.sj,g.Lu,f.d,b.y,w.UY,v.a5]]}),e=(0,l.gn)([(0,y.qB)(E)],e),e})()}}]);