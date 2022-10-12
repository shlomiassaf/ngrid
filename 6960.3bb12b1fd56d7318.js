"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[6960],{6960:(A,C,t)=>{t.r(C),t.d(C,{ColumnReorderExampleModule:()=>c});var r=t(70655),v=t(36895),a=t(14625),b=t(67513),g=t(88562),E=t(27569),p=t(50841),o=t(94650),h=t(37048),x=t(24329);let s=class{constructor(e){this.datasource=e,this.columns=(0,a.I7)().table({prop:"id",width:"40px"},{prop:"name",reorder:!0},{prop:"gender",reorder:!0,width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};s.\u0275fac=function(e){return new(e||s)(o.Y36(p.BQ))},s.\u0275cmp=o.Xpm({type:s,selectors:[["pbl-column-reorder-example"]],decls:1,vars:2,consts:[["columnReorder","",3,"dataSource","columns"]],template:function(e,n){1&e&&o._UZ(0,"pbl-ngrid",0),2&e&&o.Q6J("dataSource",n.ds)("columns",n.columns)},dependencies:[h.eZ,x.I],encapsulation:2,changeDetection:0}),s=(0,r.gn)([(0,g.en)("pbl-column-reorder-example",{title:"Simple Reordering"}),(0,r.w6)("design:paramtypes",[p.BQ])],s);let i=class{constructor(e){this.datasource=e,this.columns=(0,a.I7)().table({prop:"id",width:"40px"},{prop:"name"},{prop:"language",width:"120px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}move(e){const n=e.columnApi.findColumn("id"),m=e.columnApi.findColumn("gender");e.columnApi.moveColumn(n,m)}swap(e){const n=e.columnApi.findColumn("name"),m=e.columnApi.findColumn("birthdate");e.columnApi.swapColumns(n,m)}};i.\u0275fac=function(e){return new(e||i)(o.Y36(p.BQ))},i.\u0275cmp=o.Xpm({type:i,selectors:[["pbl-moving-with-the-api-example"]],decls:6,vars:2,consts:[[3,"click"],[3,"dataSource","columns"],["t",""]],template:function(e,n){if(1&e){const m=o.EpF();o.TgZ(0,"button",0),o.NdJ("click",function(){o.CHM(m);const f=o.MAs(5);return o.KtG(n.move(f))}),o._uU(1,"Move id after gender"),o.qZA(),o.TgZ(2,"button",0),o.NdJ("click",function(){o.CHM(m);const f=o.MAs(5);return o.KtG(n.swap(f))}),o._uU(3,"Swap name after birthdate"),o.qZA(),o._UZ(4,"pbl-ngrid",1,2)}2&e&&(o.xp6(4),o.Q6J("dataSource",n.ds)("columns",n.columns))},dependencies:[h.eZ],encapsulation:2,changeDetection:0}),i=(0,r.gn)([(0,g.en)("pbl-moving-with-the-api-example",{title:"Moving With The Api"}),(0,r.w6)("design:paramtypes",[p.BQ])],i);let d=class{constructor(e){this.datasource=e,this.columns=(0,a.I7)().table({prop:"id",wontBudge:!0,reorder:!1,width:"40px"},{prop:"name",reorder:!0},{prop:"gender",reorder:!0,width:"50px"},{prop:"birthdate",wontBudge:!0,type:"date",reorder:!1}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};d.\u0275fac=function(e){return new(e||d)(o.Y36(p.BQ))},d.\u0275cmp=o.Xpm({type:d,selectors:[["pbl-locking-columns-example"]],decls:1,vars:2,consts:[["columnReorder","",3,"dataSource","columns"]],template:function(e,n){1&e&&o._UZ(0,"pbl-ngrid",0),2&e&&o.Q6J("dataSource",n.ds)("columns",n.columns)},dependencies:[h.eZ,x.I],encapsulation:2,changeDetection:0}),d=(0,r.gn)([(0,g.en)("pbl-locking-columns-example",{title:"Locking Columns"}),(0,r.w6)("design:paramtypes",[p.BQ])],d);let u=class{constructor(e){this.datasource=e,this.columns=(0,a.I7)().default({reorder:!0}).table({prop:"id",wontBudge:!0,width:"40px"},{prop:"name"},{prop:"gender",width:"50px"},{prop:"email",width:"150px"},{prop:"country"},{prop:"language"},{prop:"birthdate",type:"date"},{prop:"balance"}).headerGroup({label:"Un-Locked",columnIds:["name","gender"]},{label:"Locked",columnIds:["country","language"]}).headerGroup({label:"Gender, Email & Country",columnIds:["gender","email","country"]},{label:"Birthday & Balance",columnIds:["birthdate","balance"]}).build(),this.ds=(0,a.AV)().onTrigger(()=>this.datasource.getPeople(0,500)).create()}};u.\u0275fac=function(e){return new(e||u)(o.Y36(p.BQ))},u.\u0275cmp=o.Xpm({type:u,selectors:[["pbl-group-columns-lock-example"]],decls:1,vars:2,consts:[["columnReorder","",3,"dataSource","columns"]],template:function(e,n){1&e&&o._UZ(0,"pbl-ngrid",0),2&e&&o.Q6J("dataSource",n.ds)("columns",n.columns)},dependencies:[h.eZ,x.I],encapsulation:2,changeDetection:0}),u=(0,r.gn)([(0,g.en)("pbl-group-columns-lock-example",{title:"Group Columns Lock"}),(0,r.w6)("design:paramtypes",[p.BQ])],u),t(63720);let c=class{};c.\u0275fac=function(e){return new(e||c)},c.\u0275mod=o.oAB({type:c}),c.\u0275inj=o.cJS({imports:[v.ez,E.a,a.dC,b.Ij.withDefaultTemplates()]}),c=(0,r.gn)([(0,g.qB)(s,i,d,u)],c)}}]);