"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[1367],{27569:(x,r,e)=>{e.d(r,{a:()=>g});var o=e(77093),c=e(23322),l=e(88562),i=e(5e3);let g=(()=>{class a{}return a.\u0275fac=function(h){return new(h||a)},a.\u0275mod=i.oAB({type:a}),a.\u0275inj=i.cJS({imports:[o.ae,c.aT,l.RF,o.ae,c.aT,l.RF]}),a})()},31367:(x,r,e)=>{e.r(r),e.d(r,{ColumnWidthFeatureExampleModule:()=>m});var o=e(70655),c=e(69808),l=e(14625),i=e(88562),g=e(27569),a=e(50841),t=e(5e3),h=e(37048);let p=class{constructor(n){this.datasource=n,this.columns=(0,l.I7)().table({prop:"id",width:"50px",pIndex:!0},{prop:"name",width:"25%"},{prop:"email"},{prop:"country",width:"35%"},{prop:"language"},{prop:"settings.timezone",label:"TZ",width:"30px"},{prop:"balance"},{prop:"gender"}).build(),this.ds=(0,l.AV)().onTrigger(()=>this.datasource.getPeople(0,5)).create()}};p.\u0275fac=function(n){return new(n||p)(t.Y36(a.BQ))},p.\u0275cmp=t.Xpm({type:p,selectors:[["pbl-column-width-example-component"]],decls:1,vars:2,consts:[[3,"dataSource","columns"]],template:function(n,s){1&n&&t._UZ(0,"pbl-ngrid",0),2&n&&t.Q6J("dataSource",s.ds)("columns",s.columns)},dependencies:[h.eZ],encapsulation:2,changeDetection:0}),p=(0,o.gn)([(0,i.en)("pbl-column-width-example-component",{title:"Column Width"}),(0,o.w6)("design:paramtypes",[a.BQ])],p);let u=class{constructor(n){this.datasource=n,this.columns=(0,l.I7)().table({prop:"id",width:"50px",pIndex:!0},{prop:"name",width:"25%"},{prop:"email",minWidth:450},{prop:"country",width:"35%"},{prop:"language",maxWidth:50},{prop:"settings.timezone",label:"TZ",width:"30px"},{prop:"balance"},{prop:"gender"}).headerGroup({label:"Name & Email",columnIds:["name","email"]},{label:"Country & Language",columnIds:["country","language"]}).build(),this.ds=(0,l.AV)().onTrigger(()=>this.datasource.getPeople(0,5)).create()}};u.\u0275fac=function(n){return new(n||u)(t.Y36(a.BQ))},u.\u0275cmp=t.Xpm({type:u,selectors:[["pbl-min-column-width-example-component"]],decls:1,vars:2,consts:[[3,"dataSource","columns"]],template:function(n,s){1&n&&t._UZ(0,"pbl-ngrid",0),2&n&&t.Q6J("dataSource",s.ds)("columns",s.columns)},dependencies:[h.eZ],encapsulation:2,changeDetection:0}),u=(0,o.gn)([(0,i.en)("pbl-min-column-width-example-component",{title:"Minimum Column Width"}),(0,o.w6)("design:paramtypes",[a.BQ])],u);let m=class{};m.\u0275fac=function(n){return new(n||m)},m.\u0275mod=t.oAB({type:m}),m.\u0275inj=t.cJS({imports:[c.ez,g.a,l.dC]}),m=(0,o.gn)([(0,i.qB)(p,u)],m)}}]);