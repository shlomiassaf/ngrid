(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{"2MRV":function(e,t,n){"use strict";n.r(t),n.d(t,"HideColumnFeatureExampleModule",function(){return j});var o=n("mrSG"),c=n("ofXK"),i=n("NFeN"),l=n("d3UM"),a=n("XEBs"),r=n("YT2F"),s=n("WPM6"),u=n("fluT"),p=n("fXoL"),d=n("XkVd"),b=n("IO+B"),m=n("Lj3m"),h=n("FKr1");function g(e,t){if(1&e){const e=p.bc();p.ac(0,"mat-option",8),p.lc("onSelectionChange",function(t){p.Hc(e);const n=p.pc(2);return t.isUserInput&&n.toggleColumn(n.hideColumns,t.source.value)}),p.Sc(1),p.Zb()}if(2&e){const e=t.$implicit;p.wc("value",e.id),p.Hb(1),p.Tc(e.label)}}function f(e,t){if(1&e&&(p.ac(0,"div",3),p.Vb(1,"div",4),p.ac(2,"div",5),p.ac(3,"mat-select",6),p.ac(4,"mat-select-trigger"),p.ac(5,"mat-icon"),p.Sc(6,"remove_red_eye"),p.Zb(),p.Sc(7),p.Zb(),p.Qc(8,g,2,2,"mat-option",7),p.Zb(),p.Zb(),p.Zb()),2&e){const e=p.pc(),t=p.Ec(1);p.Hb(3),p.wc("value",e.hideColumns),p.Hb(4),p.Uc("",e.hideColumns.length," "),p.Hb(1),p.wc("ngForOf",t.columnApi.columns)}}const w=Object(a.r)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build();let v=(()=>{let e=class{constructor(e){this.datasource=e,this.hideColumns=["bio"],this.columns=w,this.ds=Object(a.s)().onTrigger(()=>this.datasource.getPeople(0,15)).create()}toggleColumn(e,t){const n=e.indexOf(t);-1===n?e.push(t):e.splice(n,1)}};return e.\u0275fac=function(t){return new(t||e)(p.Ub(u.a))},e.\u0275cmp=p.Ob({type:e,selectors:[["pbl-hide-columns-example-component"]],decls:3,vars:4,consts:[[3,"hideColumns","dataSource","columns"],["pblTbl1",""],["class","pbl-ngrid-row",4,"pblNgridOuterSection"],[1,"pbl-ngrid-row"],[1,"pbl-ngrid-header-cell"],[1,"pbl-ngrid-header-cell",2,"flex","0 0 70px"],["multiple","",3,"value"],[3,"value","onSelectionChange",4,"ngFor","ngForOf"],[3,"value","onSelectionChange"]],template:function(e,t){1&e&&(p.ac(0,"pbl-ngrid",0,1),p.Qc(2,f,9,3,"div",2),p.Zb()),2&e&&(p.wc("hideColumns",t.hideColumns)("dataSource",t.ds)("columns",t.columns),p.Hb(2),p.wc("pblNgridOuterSection","top"))},directives:[d.a,b.a,m.a,l.a,l.c,i.a,c.o,h.m],styles:[""],encapsulation:2,changeDetection:0}),e=Object(o.a)([Object(r.e)("pbl-hide-columns-example-component",{title:"Hide Columns"}),Object(o.b)("design:paramtypes",[u.a])],e),e})();function C(e,t){if(1&e){const e=p.bc();p.ac(0,"mat-option",8),p.lc("onSelectionChange",function(t){p.Hc(e);const n=p.pc(2);return t.isUserInput&&n.toggleColumn(n.hideColumns,t.source.value)}),p.Sc(1),p.Zb()}if(2&e){const e=t.$implicit;p.wc("value",e.id),p.Hb(1),p.Tc(e.label)}}function O(e,t){if(1&e&&(p.ac(0,"div",3),p.Vb(1,"div",4),p.ac(2,"div",5),p.ac(3,"mat-select",6),p.ac(4,"mat-select-trigger"),p.ac(5,"mat-icon"),p.Sc(6,"remove_red_eye"),p.Zb(),p.Sc(7),p.Zb(),p.Qc(8,C,2,2,"mat-option",7),p.Zb(),p.Zb(),p.Zb()),2&e){const e=p.pc(),t=p.Ec(1);p.Hb(3),p.wc("value",e.hideColumns),p.Hb(4),p.Uc("",e.hideColumns.length," "),p.Hb(1),p.wc("ngForOf",t.columnApi.columns)}}const S=Object(a.r)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio",minWidth:100,maxWidth:150},{prop:"email",minWidth:250,width:"250px"},{prop:"country"},{prop:"language",headerType:"language"}).headerGroup({label:"Personal Info",columnIds:["name","gender","birthdate"]},{label:"Contact Info",columnIds:["email","country","language"]}).build();let x=(()=>{let e=class{constructor(e){this.datasource=e,this.hideColumns=[],this.columns=S,this.ds=Object(a.s)().onTrigger(()=>this.datasource.getPeople(0,15)).create()}toggleColumn(e,t){const n=e.indexOf(t);-1===n?e.push(t):e.splice(n,1)}};return e.\u0275fac=function(t){return new(t||e)(p.Ub(u.a))},e.\u0275cmp=p.Ob({type:e,selectors:[["pbl-hide-columns-with-group-headers-example-component"]],decls:3,vars:4,consts:[[3,"hideColumns","dataSource","columns"],["pblTbl2",""],["class","pbl-ngrid-row",4,"pblNgridOuterSection"],[1,"pbl-ngrid-row"],[1,"pbl-ngrid-header-cell"],[1,"pbl-ngrid-header-cell",2,"flex","0 0 70px"],["multiple","",3,"value"],[3,"value","onSelectionChange",4,"ngFor","ngForOf"],[3,"value","onSelectionChange"]],template:function(e,t){1&e&&(p.ac(0,"pbl-ngrid",0,1),p.Qc(2,O,9,3,"div",2),p.Zb()),2&e&&(p.wc("hideColumns",t.hideColumns)("dataSource",t.ds)("columns",t.columns),p.Hb(2),p.wc("pblNgridOuterSection","top"))},directives:[d.a,b.a,m.a,l.a,l.c,i.a,c.o,h.m],styles:[""],encapsulation:2,changeDetection:0}),e=Object(o.a)([Object(r.e)("pbl-hide-columns-with-group-headers-example-component",{title:"Hide Columns with Group Headers"}),Object(o.b)("design:paramtypes",[u.a])],e),e})(),j=(()=>{let e=class{};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=p.Sb({type:e}),e.\u0275inj=p.Rb({imports:[[c.c,s.a,i.b,l.b,a.j]]}),e=Object(o.a)([Object(r.a)(v,x)],e),e})()},WPM6:function(e,t,n){"use strict";n.d(t,"a",function(){return a});var o=n("XiUz"),c=n("znSr"),i=n("YT2F"),l=n("fXoL");let a=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=l.Sb({type:e}),e.\u0275inj=l.Rb({imports:[[o.e,c.b,i.l],o.e,c.b,i.l]}),e})()}}]);