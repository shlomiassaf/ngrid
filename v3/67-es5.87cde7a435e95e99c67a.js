!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var a=0;a<t.length;a++){var o=t[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function a(e){return function(e){if(Array.isArray(e))return o(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return o(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);"Object"===a&&e.constructor&&(a=e.constructor.name);if("Map"===a||"Set"===a)return Array.from(e);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return o(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var a=0,o=new Array(t);a<t;a++)o[a]=e[a];return o}(window.webpackJsonp=window.webpackJsonp||[]).push([[67],{Q5Bs:function(o,n,r){"use strict";r.r(n),r.d(n,"VirtualScrollPerformanceDemoExampleModule",function(){return K});var l=r("mrSG"),c=r("ofXK"),i=r("kmnG"),u=r("d3UM"),s=r("5RNC"),d=r("QibW"),p=r("bSwM"),b=r("XEBs"),h=r("LnE1"),f=r("4dOD"),m=r("6JOf"),w=r("BuSo"),g=r("+9h+"),v=r("MhSk"),y=r("Lr2k"),S=r("YT2F"),C=r("WPM6"),x=r("mwjq"),T=r("fXoL"),k=r("fluT"),M=r("XiUz"),Z=r("FKr1"),A=r("XkVd"),H=r("7WRX"),O=r("Zswv"),j=r("BxRN"),B=r("4DA5"),D=r("cGur"),I=r("gAVq"),P=r("IO+B"),R=r("Dh3D"),L=r("+Czz"),z=r("kvXS"),U=r("aR4q"),F=r("tQNW");function Q(e,t){if(1&e){var a=T.bc();T.ac(0,"mat-slider",13),T.lc("change",function(e){return T.Hc(a),T.pc().wheelMode=e.value}),T.Zb()}if(2&e){var o=T.pc();T.wc("value",o.wheelMode)}}function E(e,t){if(1&e&&(T.ac(0,"div",18),T.Sc(1),T.qc(2,"currency"),T.Zb()),2&e){var a=t.value,o=t.col,n=t.row;T.wc("ngridCellClass",a<0?o.type.data.pbl:o.type.data.pos),T.Hb(1),T.Tc(T.tc(2,2,a,o.type.data.meta.currency(n),"symbol",o.type.data.format))}}function G(e,t){if(1&e&&(T.ac(0,"div"),T.Sc(1),T.Zb()),2&e){var a=t.col,o=t.row;T.Hb(1),T.Tc(a.type.data.flagAndCountry(o))}}function N(e,t){if(1&e&&(T.ac(0,"pbl-ngrid",14),T.Vb(1,"pbl-demo-action-row",15),T.Qc(2,E,3,7,"div",16),T.Qc(3,G,2,1,"div",17),T.Zb()),2&e){var a=T.pc();T.wc("dataSource",a.ds)("columns",a.columns)("wheelMode",a.wheelMode)("hideColumns",a.hideColumns),T.Hb(2),T.wc("pblNgridCellTypeDef","accountBalance"),T.Hb(1),T.wc("pblNgridCellTypeDef","flagAndCountry")}}var W={currency:function(e){return W.data.countries[e.country].currencies[0]},flagAndCountry:function(e){return W.flag(e)+" "+W.name(e)},name:function(e){return W.data.countries[e.country].name},flag:function(e){return W.data.countries[e.country].emoji},data:void 0},X={name:"accountBalance",data:{pbl:"balance-negative",pos:"balance-positive",format:"1.0-2",meta:W}};function V(){var e,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],o=function(e){return t?void 0:e};return(e=Object(b.r)().default({minWidth:100,resize:!0})).table.apply(e,[{prop:"drag_and_drop_handle",type:"drag_and_drop_handle",minWidth:48,maxWidth:48},{prop:"selection",width:"48px"},{prop:"id",pIndex:!0,width:"40px"},{prop:"name",sort:!0,reorder:!0},{prop:"country",headerType:o("country"),type:o({name:"flagAndCountry",data:W}),width:"150px"},{prop:"jobTitle"},{prop:"accountId"},{prop:"accountType",reorder:!0},{prop:"primeAccount",type:o("visualBool"),width:"24px"},{prop:"creditScore",type:o("starRatings"),width:"50px"},{prop:"balance",type:o(X),sort:!0}].concat(a(Array.from(new Array(12)).map(function(e,t){return{prop:"monthlyBalance."+t,type:o(X),sort:!0}})))).headerGroup({label:"Customer Info",columnIds:["name","country","jobTitle"]},{label:"Account Info",columnIds:["accountId","accountType","primeAccount","creditScore","balance"]},{label:"Monthly Balance",columnIds:Array.from(new Array(12)).map(function(e,t){return"monthlyBalance."+t})}).footer({id:"reref",label:"FOOTER"}).footer({id:"rere123f",label:"FOOTER2"}).build()}var _,q,J=((q=function(){function a(t,o){e(this,a),this.datasource=t,this.cdr=o,this.columns=V(),this.ds=this.getDatasource(),this.collectionSize=1e4,this.wheelMode="passive",this.wheelModeState="passive",this.plainColumns=!1,this.showTable=!0,this.hideColumns=[],t.getCountries().then(function(e){return W.data=e})}var o,n,r;return o=a,(n=[{key:"toggleColumn",value:function(e,t){var a=e.indexOf(t);-1===a?e.push(t):e.splice(a,1)}},{key:"togglePlainColumns",value:function(){var e=this;this.plainColumns=!this.plainColumns,this.showTable=!1,setTimeout(function(){e.showTable=!0,e.columns=V(e.plainColumns),e.ds=e.getDatasource(),e.cdr.detectChanges()},100)}},{key:"collectionSizeChange",value:function(e){this.collectionSize=e,this.ds.refresh()}},{key:"wheelModeChange",value:function(e){switch(this.wheelModeState=e.value,this.wheelModeState){case"passive":case"blocking":this.wheelMode=this.wheelModeState;break;default:this.wheelMode=15}}},{key:"getDatasource",value:function(){var e=this;return Object(b.s)().onTrigger(function(){return e.datasource.getCustomers(0,e.collectionSize)}).create()}}])&&t(o.prototype,n),r&&t(o,r),a}()).\u0275fac=function(e){return new(e||q)(T.Ub(k.a),T.Ub(T.h))},q.\u0275cmp=T.Ob({type:q,selectors:[["pbl-virtual-scroll-performance-demo-example"]],viewQuery:function(e,t){var a;1&e&&T.Zc(b.f,1),2&e&&T.Dc(a=T.mc())&&(t.pblTable=a.first)},decls:32,vars:15,consts:[["fxLayout","column","fxLayoutGap","16px",1,"pbl-fill-absolute"],["fxLayout","row","fxLayoutGap","16px",2,"width","100%"],["fxLayout","row","fxLayoutGap","8px",3,"value","disabled","change"],["value","passive"],["value","blocking"],["value","threshold"],["thumbLabel","","min","1","max","55",3,"value","change",4,"ngIf"],[3,"checked","change"],["fxFlex","nogrow",2,"width","200px"],[3,"value","selectionChange"],[3,"value"],[2,"flex","1 1 100%","display","flex","min-height","0px"],["class","pbl-ngrid-cell-ellipsis pbl-ngrid-header-cell-ellipsis","style","height: 100%; width: 100%;","vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","showFooter","","rowReorder","","columnReorder","","blockUi","","matSort","","cellTooltip","","matCheckboxSelection","selection",3,"dataSource","columns","wheelMode","hideColumns",4,"ngIf"],["thumbLabel","","min","1","max","55",3,"value","change"],["vScrollAuto","","maxBufferPx","100","minBufferPx","50","showHeader","","showFooter","","rowReorder","","columnReorder","","blockUi","","matSort","","cellTooltip","","matCheckboxSelection","selection",1,"pbl-ngrid-cell-ellipsis","pbl-ngrid-header-cell-ellipsis",2,"height","100%","width","100%",3,"dataSource","columns","wheelMode","hideColumns"],["filter","","label","Virtual Scroll Performance","showFps",""],[3,"ngridCellClass",4,"pblNgridCellTypeDef"],[4,"pblNgridCellTypeDef"],[3,"ngridCellClass"]],template:function(e,t){1&e&&(T.ac(0,"div",0),T.ac(1,"div",1),T.ac(2,"mat-radio-group",2),T.lc("change",function(e){return t.wheelModeChange(e)}),T.ac(3,"mat-radio-button",3),T.Sc(4,"Passive"),T.Zb(),T.ac(5,"mat-radio-button",4),T.Sc(6,"Blocking"),T.Zb(),T.ac(7,"mat-radio-button",5),T.Sc(8),T.Zb(),T.Zb(),T.Qc(9,Q,1,1,"mat-slider",6),T.Zb(),T.ac(10,"mat-checkbox",7),T.lc("change",function(){return t.togglePlainColumns()}),T.Sc(11,"Use plain columns (higher frame rate)"),T.Zb(),T.ac(12,"mat-form-field",8),T.ac(13,"mat-select",9),T.lc("selectionChange",function(e){return t.collectionSizeChange(e.value)}),T.ac(14,"mat-option",10),T.Sc(15,"10"),T.Zb(),T.ac(16,"mat-option",10),T.Sc(17,"100"),T.Zb(),T.ac(18,"mat-option",10),T.Sc(19,"500"),T.Zb(),T.ac(20,"mat-option",10),T.Sc(21,"1000"),T.Zb(),T.ac(22,"mat-option",10),T.Sc(23,"10000"),T.Zb(),T.ac(24,"mat-option",10),T.Sc(25,"50000"),T.Zb(),T.ac(26,"mat-option",10),T.Sc(27,"100000"),T.Zb(),T.ac(28,"mat-option",10),T.Sc(29,"400000"),T.Zb(),T.Zb(),T.Zb(),T.ac(30,"div",11),T.Qc(31,N,4,6,"pbl-ngrid",12),T.Zb(),T.Zb()),2&e&&(T.Hb(2),T.wc("value",t.wheelModeState)("disabled",null==t.pblTable?null:t.pblTable.virtualPagingActive),T.Hb(6),T.Uc("Threshold","threshold"===t.wheelModeState?" ("+t.wheelMode+")":"",""),T.Hb(1),T.wc("ngIf","threshold"===t.wheelModeState),T.Hb(1),T.wc("checked",t.plainColumns),T.Hb(3),T.wc("value",t.collectionSize),T.Hb(1),T.wc("value",10),T.Hb(2),T.wc("value",100),T.Hb(2),T.wc("value",500),T.Hb(2),T.wc("value",1e3),T.Hb(2),T.wc("value",1e4),T.Hb(2),T.wc("value",5e4),T.Hb(2),T.wc("value",1e5),T.Hb(2),T.wc("value",4e5),T.Hb(3),T.wc("ngIf",t.showTable))},directives:[M.c,M.d,d.b,d.a,c.p,p.a,i.b,M.a,u.a,Z.m,s.a,A.a,H.a,O.a,j.b,B.b,D.b,I.b,P.a,R.a,L.b,z.a,U.a,F.a],pipes:[c.d],styles:[".balance-negative{background:rgba(255,0,0,.33)}.balance-positive{background:rgba(0,128,0,.33)}"],encapsulation:2,changeDetection:0}),q=Object(l.a)([Object(S.e)("pbl-virtual-scroll-performance-demo-example",{title:"Virtual Scroll Performance Demo"}),Object(l.b)("design:paramtypes",[k.a,T.h])],q)),K=((_=function t(){e(this,t)}).\u0275fac=function(e){return new(e||_)},_.\u0275mod=T.Sb({type:_}),_.\u0275inj=T.Rb({providers:[b.n],imports:[[c.c,i.d,u.b,s.b,d.c,p.b,C.a,x.b,b.j.withCommon([{component:x.a}]),h.a.withDefaultTemplates(),f.a,m.a,w.a,g.a,v.a,y.a]]}),_=Object(l.a)([Object(S.a)(J)],_))}}])}();