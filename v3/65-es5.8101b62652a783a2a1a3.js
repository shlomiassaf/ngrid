!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function n(e){return function(e){if(Array.isArray(e))return a(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return a(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}(window.webpackJsonp=window.webpackJsonp||[]).push([[65],{HsLd:function(a,r,o){"use strict";o.r(r),o.d(r,"InfiniteScrollPerformanceDemoExampleModule",function(){return te});var i=o("mrSG"),l=o("ofXK"),c=o("kmnG"),u=o("d3UM"),s=o("5RNC"),d=o("QibW"),p=o("bSwM"),f=o("Xa2L"),b=o("XEBs"),h=o("LnE1"),m=o("4dOD"),g=o("6JOf"),w=o("BuSo"),v=o("+9h+"),y=o("MhSk"),S=o("Lr2k"),C=o("LpJu"),x=o("YT2F"),T=o("WPM6"),I=o("mwjq"),M=o("fXoL"),k=o("fluT"),A=o("XiUz"),O=o("XkVd"),P=o("7WRX"),j=o("BxRN"),D=o("4DA5"),L=o("cGur"),B=o("IO+B"),H=o("Dh3D"),R=o("+Czz"),Z=o("kvXS"),N=o("aR4q"),U=o("L3Ad"),q=o("PIXP"),Q=o("tQNW"),X=o("8r4k");function z(e,t){if(1&e){var n=M.bc();M.ac(0,"mat-slider",10),M.lc("change",function(e){return M.Hc(n),M.pc().wheelMode=e.value}),M.Zb()}if(2&e){var a=M.pc();M.wc("value",a.wheelMode)}}function G(e,t){if(1&e&&(M.ac(0,"div",17),M.Sc(1),M.qc(2,"currency"),M.Zb()),2&e){var n=t.value,a=t.col,r=t.row;M.wc("ngridCellClass",n<0?a.type.data.pbl:a.type.data.pos),M.Hb(1),M.Tc(M.tc(2,2,n,a.type.data.meta.currency(r),"symbol",a.type.data.format))}}function E(e,t){if(1&e&&(M.ac(0,"div"),M.Sc(1),M.Zb()),2&e){var n=t.col,a=t.row;M.Hb(1),M.Tc(n.type.data.flagAndCountry(a))}}function V(e,t){if(1&e&&(M.ac(0,"div"),M.Sc(1),M.qc(2,"number"),M.qc(3,"number"),M.qc(4,"number"),M.Zb()),2&e){var n=M.pc(2);M.Hb(1),M.Wc(" Showing ",M.rc(2,3,n.ds.renderStart)," to ",M.rc(3,5,n.ds.renderStart+n.ds.renderLength)," out of ",M.rc(4,7,n.ds.length),"")}}function W(e,t){1&e&&(M.ac(0,"pbl-ngrid-row",18),M.Vb(1,"mat-spinner",19),M.Zb())}function F(e,t){if(1&e&&(M.ac(0,"pbl-ngrid",11),M.Vb(1,"pbl-demo-action-row",12),M.Qc(2,G,3,7,"div",13),M.Qc(3,E,2,1,"div",14),M.Qc(4,V,5,9,"div",15),M.Qc(5,W,2,0,"pbl-ngrid-row",16),M.Zb()),2&e){var n=M.pc();M.wc("dataSource",n.ds)("columns",n.columns)("wheelMode",n.wheelMode)("hideColumns",n.hideColumns),M.Hb(2),M.wc("pblNgridCellTypeDef","accountBalance"),M.Hb(1),M.wc("pblNgridCellTypeDef","flagAndCountry"),M.Hb(1),M.wc("pblNgridFooterCellDef","footerPageInfo")}}var J={currency:function(e){var t;return null===(t=J.data.countries[e.country])||void 0===t?void 0:t.currencies[0]},flagAndCountry:function(e){return J.flag(e)+" "+J.name(e)},name:function(e){var t;return null===(t=J.data.countries[e.country])||void 0===t?void 0:t.name},flag:function(e){var t;return null===(t=J.data.countries[e.country])||void 0===t?void 0:t.emoji},data:void 0},K={name:"accountBalance",data:{pbl:"balance-negative",pos:"balance-positive",format:"1.0-2",meta:J}};function Y(){var e,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],a=function(e){return t?void 0:e};return(e=Object(b.r)().default({minWidth:100,resize:!0})).table.apply(e,[{prop:"id",pIndex:!0,width:"40px"},{prop:"name",sort:!0,reorder:!0},{prop:"country",headerType:a("country"),type:a({name:"flagAndCountry",data:J}),width:"150px"},{prop:"jobTitle"},{prop:"accountId"},{prop:"accountType",reorder:!0},{prop:"primeAccount",type:a("visualBool"),width:"24px"},{prop:"creditScore",type:a("starRatings"),width:"50px"},{prop:"balance",type:a(K),sort:!0}].concat(n(Array.from(new Array(12)).map(function(e,t){return{prop:"monthlyBalance."+t,type:a(K),sort:!0}})))).headerGroup({label:"Customer Info",columnIds:["name","country","jobTitle"]},{label:"Account Info",columnIds:["accountId","accountType","primeAccount","creditScore","balance"]},{label:"Monthly Balance",columnIds:Array.from(new Array(12)).map(function(e,t){return"monthlyBalance."+t})}).footer({id:"footerPageInfo"}).footer({id:"rere123f",label:"FOOTER2"}).build()}var $,_,ee=((_=function(){function n(t,a,r){e(this,n),this.datasource=t,this.client=a,this.cdr=r,this.columns=Y(),this.ds=this.getDatasource(),this.wheelMode="passive",this.wheelModeState="passive",this.plainColumns=!1,this.showTable=!0,this.hideColumns=[]}var a,r,o;return a=n,(r=[{key:"toggleColumn",value:function(e,t){var n=e.indexOf(t);-1===n?e.push(t):e.splice(n,1)}},{key:"togglePlainColumns",value:function(){var e=this;this.plainColumns=!this.plainColumns,this.showTable=!1,setTimeout(function(){e.showTable=!0,e.columns=Y(e.plainColumns),e.ds=e.getDatasource(),e.cdr.detectChanges()},100)}},{key:"wheelModeChange",value:function(e){switch(this.wheelModeState=e.value,this.wheelModeState){case"passive":case"blocking":this.wheelMode=this.wheelModeState;break;default:this.wheelMode=15}}},{key:"getDatasource",value:function(){var e=this;return Object(C.b)().withInfiniteScrollOptions({blockSize:100,initialVirtualSize:100}).withCacheOptions("sequenceBlocks").onTrigger(function(t){if(t.isInitial)return e.datasource.getCountries().then(function(e){return J.data=e}).then(function(){return e.client.getCustomers({pagination:{itemsPerPage:100,page:1}})}).then(function(n){return console.log("Init Infinite Request!"),e.ds.updateVirtualSize(3e6),t.updateTotalLength(3e6),n.items});var n=Math.floor(t.fromRow/100)+1;return console.log("Infinite Request - Page: ".concat(n," | Items: 100 ")),e.client.getCustomers({pagination:{itemsPerPage:100,page:1}}).then(function(e){return e.items.map(function(e){return Object.assign(Object.create(e),{id:e.id+100*(n-1)})})})}).create()}}])&&t(a.prototype,r),o&&t(a,o),n}()).\u0275fac=function(e){return new(e||_)(M.Ub(k.a),M.Ub(k.b),M.Ub(M.h))},_.\u0275cmp=M.Ob({type:_,selectors:[["pbl-infinite-scroll-performance-demo-example"]],viewQuery:function(e,t){var n;1&e&&M.Zc(b.f,1),2&e&&M.Dc(n=M.mc())&&(t.pblTable=n.first)},decls:14,vars:6,consts:[["fxLayout","column","fxLayoutGap","16px",1,"pbl-fill-absolute"],["fxLayout","row","fxLayoutGap","16px",2,"width","100%"],["fxLayout","row","fxLayoutGap","8px",3,"value","disabled","change"],["value","passive"],["value","blocking"],["value","threshold"],["thumbLabel","","min","1","max","55",3,"value","change",4,"ngIf"],[3,"checked","change"],[2,"flex","1 1 100%","display","flex","min-height","0px"],["class","pbl-ngrid-cell-ellipsis pbl-ngrid-header-cell-ellipsis","style","height: 100%; width: 100%;","vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","columnReorder","","blockUi","","matSort","","cellTooltip","",3,"dataSource","columns","wheelMode","hideColumns",4,"ngIf"],["thumbLabel","","min","1","max","55",3,"value","change"],["vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","columnReorder","","blockUi","","matSort","","cellTooltip","",1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",2,"height","100%","width","100%",3,"dataSource","columns","wheelMode","hideColumns"],["label","Infinite Scroll Performance","showFps",""],[3,"ngridCellClass",4,"pblNgridCellTypeDef"],[4,"pblNgridCellTypeDef"],[4,"pblNgridFooterCellDef"],["in","","class","pbl-ngrid-infinite-virtual-row","infiniteRow","",4,"pblNgridInfiniteVirtualRowDef"],[3,"ngridCellClass"],["in","","infiniteRow","",1,"pbl-ngrid-infinite-virtual-row"],["diameter","24"]],template:function(e,t){1&e&&(M.ac(0,"div",0),M.ac(1,"div",1),M.ac(2,"mat-radio-group",2),M.lc("change",function(e){return t.wheelModeChange(e)}),M.ac(3,"mat-radio-button",3),M.Sc(4,"Passive"),M.Zb(),M.ac(5,"mat-radio-button",4),M.Sc(6,"Blocking"),M.Zb(),M.ac(7,"mat-radio-button",5),M.Sc(8),M.Zb(),M.Zb(),M.Qc(9,z,1,1,"mat-slider",6),M.Zb(),M.ac(10,"mat-checkbox",7),M.lc("change",function(){return t.togglePlainColumns()}),M.Sc(11,"Use plain columns (higher frame rate)"),M.Zb(),M.ac(12,"div",8),M.Qc(13,F,6,7,"pbl-ngrid",9),M.Zb(),M.Zb()),2&e&&(M.Hb(2),M.wc("value",t.wheelModeState)("disabled",null==t.pblTable?null:t.pblTable.virtualPagingActive),M.Hb(6),M.Uc("Threshold","threshold"===t.wheelModeState?" ("+t.wheelMode+")":"",""),M.Hb(1),M.wc("ngIf","threshold"===t.wheelModeState),M.Hb(1),M.wc("checked",t.plainColumns),M.Hb(3),M.wc("ngIf",t.showTable))},directives:[A.c,A.d,d.b,d.a,l.p,p.a,s.a,O.a,P.a,j.b,D.b,L.b,B.a,H.a,R.b,Z.a,N.a,U.a,q.a,Q.a,X.a,f.b],pipes:[l.d,l.g],styles:[".balance-negative{background:rgba(255,0,0,.33)}.balance-positive{background:rgba(0,128,0,.33)}"],encapsulation:2,changeDetection:0}),_=Object(i.a)([Object(x.e)("pbl-infinite-scroll-performance-demo-example",{title:"Infinite Scroll Performance Demo"}),Object(i.b)("design:paramtypes",[k.a,k.b,M.h])],_)),te=(($=function t(){e(this,t)}).\u0275fac=function(e){return new(e||$)},$.\u0275mod=M.Sb({type:$}),$.\u0275inj=M.Rb({providers:[b.n],imports:[[l.c,c.d,u.b,s.b,d.c,p.b,f.a,T.a,I.b,b.j.withCommon([{component:I.a}]),h.a.withDefaultTemplates(),m.a,g.a,w.a,v.a,y.a,S.a,C.a]]}),$=Object(i.a)([Object(x.a)(ee)],$))}}])}();