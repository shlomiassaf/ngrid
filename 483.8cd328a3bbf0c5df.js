"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[483],{27569:(M,g,t)=>{t.d(g,{a:()=>p});var c=t(1576),u=t(55829),i=t(88562),m=t(94650);let p=(()=>{class e{}return e.\u0275fac=function(d){return new(d||e)},e.\u0275mod=m.oAB({type:e}),e.\u0275inj=m.cJS({imports:[c.ae,u.aT,i.RF,c.ae,u.aT,i.RF]}),e})()},50483:(M,g,t)=>{t.r(g),t.d(g,{ManualDatasourceTriggerExampleModule:()=>r});var c=t(70655),u=t(36895),i=t(14625),m=t(88562),p=t(27569),e=t(50841),a=t(94650),d=t(37048);function E(s,o){if(1&s){const n=a.EpF();a.TgZ(0,"button",2),a.NdJ("click",function(){const f=a.CHM(n).$implicit,x=a.oxw();return a.KtG(x.refresh(f))}),a._uU(1),a.qZA()}if(2&s){const n=o.$implicit;a.xp6(1),a.hij("",n," Rows")}}const T=function(){return[50,100,500,1e3]};let l=class{constructor(o){this.datasource=o,this.columns={table:{cols:[{prop:"id"},{prop:"name"},{prop:"email"}]}},this.dsManualTrigger=(0,i.AV)().onTrigger(n=>this.datasource.getPeople(0,n.data.curr||n.data.prev||0)).create()}refresh(o){this.dsManualTrigger.refresh(o)}};l.\u0275fac=function(o){return new(o||l)(a.Y36(e.BQ))},l.\u0275cmp=a.Xpm({type:l,selectors:[["pbl-manual-datasource-trigger-component"]],decls:2,vars:4,consts:[["mat-stroked-button","",3,"click",4,"ngFor","ngForOf"],[3,"dataSource","columns"],["mat-stroked-button","",3,"click"]],template:function(o,n){1&o&&(a.YNc(0,E,2,1,"button",0),a._UZ(1,"pbl-ngrid",1)),2&o&&(a.Q6J("ngForOf",a.DdM(3,T)),a.xp6(1),a.Q6J("dataSource",n.dsManualTrigger)("columns",n.columns))},dependencies:[u.sg,d.eZ],encapsulation:2,changeDetection:0}),l=(0,c.gn)([(0,m.en)("pbl-manual-datasource-trigger-component",{title:"Manual Trigger"}),(0,c.w6)("design:paramtypes",[e.BQ])],l);let r=class{};r.\u0275fac=function(o){return new(o||r)},r.\u0275mod=a.oAB({type:r}),r.\u0275inj=a.cJS({imports:[u.ez,p.a,i.dC]}),r=(0,c.gn)([(0,m.qB)(l)],r)}}]);