(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[1085],{51085:(e,t,o)=>{"use strict";o.r(t),o.d(t,{VirtualScrollPerformanceDemoExampleModule:()=>G});var l=o(64762),a=o(61511),n=o(66283),i=o(4786),r=o(46594),c=o(54810),s=o(29236),u=o(64914),p=o(44903),d=o(39030),h=o(89393),m=o(25207),g=o(97239),f=o(18794),b=o(51467),w=o(91668),x=o(70946),y=o(68043),v=o(31572),Z=o(46418),C=o(3722),T=o(71522),A=o(88853),S=o(2367),q=o(22759),M=o(83077),Q=o(31486),J=o(20467),_=o(14896),U=o(93638),k=o(58623),B=o(21570),I=o(12732),D=o(55992),N=o(10803);function P(e,t){if(1&e){const e=v.EpF();v.TgZ(0,"mat-slider",13),v.NdJ("change",function(t){return v.CHM(e),v.oxw().wheelMode=t.value}),v.qZA()}if(2&e){const e=v.oxw();v.Q6J("value",e.wheelMode)}}function L(e,t){if(1&e&&(v.TgZ(0,"div",18),v._uU(1),v.ALo(2,"currency"),v.qZA()),2&e){const e=t.value,o=t.col,l=t.row;v.Q6J("ngridCellClass",e<0?o.type.data.pbl:o.type.data.pos),v.xp6(1),v.Oqu(v.gM2(2,2,e,o.type.data.meta.currency(l),"symbol",o.type.data.format))}}function O(e,t){if(1&e&&(v.TgZ(0,"div"),v._uU(1),v.qZA()),2&e){const e=t.col,o=t.row;v.xp6(1),v.Oqu(e.type.data.flagAndCountry(o))}}function R(e,t){if(1&e&&(v.TgZ(0,"pbl-ngrid",14),v._UZ(1,"pbl-demo-action-row",15),v.YNc(2,L,3,7,"div",16),v.YNc(3,O,2,1,"div",17),v.qZA()),2&e){const e=v.oxw();v.Q6J("dataSource",e.ds)("columns",e.columns)("wheelMode",e.wheelMode)("hideColumns",e.hideColumns),v.xp6(2),v.Q6J("pblNgridCellTypeDef","accountBalance"),v.xp6(1),v.Q6J("pblNgridCellTypeDef","flagAndCountry")}}const Y={currency:e=>Y.data.countries[e.country].currencies[0],flagAndCountry:e=>Y.flag(e)+" "+Y.name(e),name:e=>Y.data.countries[e.country].name,flag:e=>Y.data.countries[e.country].emoji,data:void 0},z={name:"accountBalance",data:{pbl:"balance-negative",pos:"balance-positive",format:"1.0-2",meta:Y}};function F(e=!1){const t=t=>e?void 0:t;return(0,u.I7)().default({minWidth:100,resize:!0}).table({prop:"drag_and_drop_handle",type:"drag_and_drop_handle",minWidth:48,maxWidth:48},{prop:"selection",width:"48px"},{prop:"id",pIndex:!0,width:"40px"},{prop:"name",sort:!0,reorder:!0},{prop:"country",headerType:t("country"),type:t({name:"flagAndCountry",data:Y}),width:"150px"},{prop:"jobTitle"},{prop:"accountId"},{prop:"accountType",reorder:!0},{prop:"primeAccount",type:t("visualBool"),width:"24px"},{prop:"creditScore",type:t("starRatings"),width:"50px"},{prop:"balance",type:t(z),sort:!0},...Array.from(new Array(12)).map((e,o)=>({prop:`monthlyBalance.${o}`,type:t(z),sort:!0}))).headerGroup({label:"Customer Info",columnIds:["name","country","jobTitle"]},{label:"Account Info",columnIds:["accountId","accountType","primeAccount","creditScore","balance"]},{label:"Monthly Balance",columnIds:Array.from(new Array(12)).map((e,t)=>`monthlyBalance.${t}`)}).footer({id:"reref",label:"FOOTER"}).footer({id:"rere123f",label:"FOOTER2"}).build()}let j=(()=>{let e=class{constructor(e,t){this.datasource=e,this.cdr=t,this.columns=F(),this.ds=this.getDatasource(),this.collectionSize=1e4,this.wheelMode="passive",this.wheelModeState="passive",this.plainColumns=!1,this.showTable=!0,this.hideColumns=[],e.getCountries().then(e=>Y.data=e)}toggleColumn(e,t){const o=e.indexOf(t);-1===o?e.push(t):e.splice(o,1)}togglePlainColumns(){this.plainColumns=!this.plainColumns,this.showTable=!1,setTimeout(()=>{this.showTable=!0,this.columns=F(this.plainColumns),this.ds=this.getDatasource(),this.cdr.detectChanges()},100)}collectionSizeChange(e){this.collectionSize=e,this.ds.refresh()}wheelModeChange(e){switch(this.wheelModeState=e.value,this.wheelModeState){case"passive":case"blocking":this.wheelMode=this.wheelModeState;break;default:this.wheelMode=15}}getDatasource(){return(0,u.AV)().onTrigger(()=>this.datasource.getCustomers(0,this.collectionSize)).create()}};return e.\u0275fac=function(t){return new(t||e)(v.Y36(Z.BQ),v.Y36(v.sBO))},e.\u0275cmp=v.Xpm({type:e,selectors:[["pbl-virtual-scroll-performance-demo-example"]],viewQuery:function(e,t){if(1&e&&v.Gf(u.eZ,5),2&e){let e;v.iGM(e=v.CRH())&&(t.pblTable=e.first)}},decls:32,vars:15,consts:[["fxLayout","column","fxLayoutGap","16px",1,"pbl-fill-absolute"],["fxLayout","row","fxLayoutGap","16px",2,"width","100%"],["fxLayout","row","fxLayoutGap","8px",3,"value","disabled","change"],["value","passive"],["value","blocking"],["value","threshold"],["thumbLabel","","min","1","max","55",3,"value","change",4,"ngIf"],[3,"checked","change"],["fxFlex","nogrow",2,"width","200px"],[3,"value","selectionChange"],[3,"value"],[2,"flex","1 1 100%","display","flex","min-height","0px"],["class","pbl-ngrid-cell-ellipsis pbl-ngrid-header-cell-ellipsis","style","height: 100%; width: 100%;","vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","showFooter","","rowReorder","","columnReorder","","blockUi","","matSort","","cellTooltip","","matCheckboxSelection","selection",3,"dataSource","columns","wheelMode","hideColumns",4,"ngIf"],["thumbLabel","","min","1","max","55",3,"value","change"],["vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","showFooter","","rowReorder","","columnReorder","","blockUi","","matSort","","cellTooltip","","matCheckboxSelection","selection",1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",2,"height","100%","width","100%",3,"dataSource","columns","wheelMode","hideColumns"],["filter","","label","Virtual Scroll Performance","showFps",""],[3,"ngridCellClass",4,"pblNgridCellTypeDef"],[4,"pblNgridCellTypeDef"],[3,"ngridCellClass"]],template:function(e,t){1&e&&(v.TgZ(0,"div",0),v.TgZ(1,"div",1),v.TgZ(2,"mat-radio-group",2),v.NdJ("change",function(e){return t.wheelModeChange(e)}),v.TgZ(3,"mat-radio-button",3),v._uU(4,"Passive"),v.qZA(),v.TgZ(5,"mat-radio-button",4),v._uU(6,"Blocking"),v.qZA(),v.TgZ(7,"mat-radio-button",5),v._uU(8),v.qZA(),v.qZA(),v.YNc(9,P,1,1,"mat-slider",6),v.qZA(),v.TgZ(10,"mat-checkbox",7),v.NdJ("change",function(){return t.togglePlainColumns()}),v._uU(11,"Use plain columns (higher frame rate)"),v.qZA(),v.TgZ(12,"mat-form-field",8),v.TgZ(13,"mat-select",9),v.NdJ("selectionChange",function(e){return t.collectionSizeChange(e.value)}),v.TgZ(14,"mat-option",10),v._uU(15,"10"),v.qZA(),v.TgZ(16,"mat-option",10),v._uU(17,"100"),v.qZA(),v.TgZ(18,"mat-option",10),v._uU(19,"500"),v.qZA(),v.TgZ(20,"mat-option",10),v._uU(21,"1000"),v.qZA(),v.TgZ(22,"mat-option",10),v._uU(23,"10000"),v.qZA(),v.TgZ(24,"mat-option",10),v._uU(25,"50000"),v.qZA(),v.TgZ(26,"mat-option",10),v._uU(27,"100000"),v.qZA(),v.TgZ(28,"mat-option",10),v._uU(29,"400000"),v.qZA(),v.qZA(),v.qZA(),v.TgZ(30,"div",11),v.YNc(31,R,4,6,"pbl-ngrid",12),v.qZA(),v.qZA()),2&e&&(v.xp6(2),v.Q6J("value",t.wheelModeState)("disabled",null==t.pblTable?null:t.pblTable.virtualPagingActive),v.xp6(6),v.hij("Threshold","threshold"===t.wheelModeState?" ("+t.wheelMode+")":"",""),v.xp6(1),v.Q6J("ngIf","threshold"===t.wheelModeState),v.xp6(1),v.Q6J("checked",t.plainColumns),v.xp6(3),v.Q6J("value",t.collectionSize),v.xp6(1),v.Q6J("value",10),v.xp6(2),v.Q6J("value",100),v.xp6(2),v.Q6J("value",500),v.xp6(2),v.Q6J("value",1e3),v.xp6(2),v.Q6J("value",1e4),v.xp6(2),v.Q6J("value",5e4),v.xp6(2),v.Q6J("value",1e5),v.xp6(2),v.Q6J("value",4e5),v.xp6(3),v.Q6J("ngIf",t.showTable))},directives:[C.xw,C.SQ,c.VQ,c.U0,a.O5,s.oG,n.KE,C.yH,i.gD,T.ey,r.pH,A.eZ,S.B,q.Y,M.I,Q.C,J.u,_.e,U.$,k.YE,B.k,I.R,D.I,N.e],pipes:[a.H9],styles:[".balance-negative{background:rgba(255,0,0,.33)}.balance-positive{background:rgba(0,128,0,.33)}"],encapsulation:2,changeDetection:0}),e=(0,l.gn)([(0,w.en)("pbl-virtual-scroll-performance-demo-example",{title:"Virtual Scroll Performance Demo"}),(0,l.w6)("design:paramtypes",[Z.BQ,v.sBO])],e),e})(),G=(()=>{let e=class{};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=v.oAB({type:e}),e.\u0275inj=v.cJS({providers:[u.B6],imports:[[a.ez,n.lN,i.LD,r.KP,c.Fk,s.p9,x.a,y.Q,u.dC.withCommon([{component:y.a}]),p.Ij.withDefaultTemplates(),d.sx,h.sj,m.Lu,g.d,f.y,b.UY]]}),e=(0,l.gn)([(0,w.qB)(j)],e),e})()}}]);