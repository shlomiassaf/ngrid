!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[57],{DHO5:function(t,i,a){"use strict";a.r(i),a.d(i,"StrategiesExampleModule",function(){return P});var n,c,o=a("mrSG"),r=a("ofXK"),p=a("FKr1"),s=a("XEBs"),l=a("M1+n"),d=a("YT2F"),b=a("WPM6"),u=a("fluT"),m=a("fXoL"),h=a("XkVd"),f=a("yNqP"),g=((n=function t(i){var a=this;e(this,t),this.datasource=i,this.columns=Object(s.r)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=Object(s.s)().onTrigger(function(){return a.datasource.getPeople(100,500)}).create()}).\u0275fac=function(e){return new(e||n)(m.Ub(u.a))},n.\u0275cmp=m.Ob({type:n,selectors:[["pbl-fixed-size-example"]],decls:1,vars:2,consts:[["vScrollFixed","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"]],template:function(e,t){1&e&&m.Vb(0,"pbl-ngrid",0),2&e&&m.wc("dataSource",t.ds)("columns",t.columns)},directives:[h.a,f.a],styles:[""],encapsulation:2,changeDetection:0}),n=Object(o.a)([Object(d.e)("pbl-fixed-size-example",{title:"Fixed Size"}),Object(o.b)("design:paramtypes",[u.a])],n)),w=a("7WRX"),j=((c=function t(i){var a=this;e(this,t),this.datasource=i,this.columns=Object(s.r)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=Object(s.s)().onTrigger(function(){return a.datasource.getPeople(100,500)}).create()}).\u0275fac=function(e){return new(e||c)(m.Ub(u.a))},c.\u0275cmp=m.Ob({type:c,selectors:[["pbl-auto-size-example"]],decls:1,vars:2,consts:[["vScrollAuto","",3,"dataSource","columns"]],template:function(e,t){1&e&&m.Vb(0,"pbl-ngrid",0),2&e&&m.wc("dataSource",t.ds)("columns",t.columns)},directives:[h.a,w.a],styles:[""],encapsulation:2,changeDetection:0}),c=Object(o.a)([Object(d.e)("pbl-auto-size-example",{title:"Auto Size"}),Object(o.b)("design:paramtypes",[u.a])],c)),O=a("R0Ic"),v=a("ugF5"),x=a("z6lm"),y=a("NRLV"),S=a("ejGh");function R(e,t){1&e&&m.Vb(0,"pbl-ngrid-row",3)}function D(e,t){if(1&e&&(m.ac(0,"div",4),m.lc("@detailExpand.done",function(){return t.animation.end()}),m.ac(1,"div"),m.ac(2,"h1"),m.Sc(3,"Detail Row"),m.Zb(),m.ac(4,"pre"),m.Sc(5),m.qc(6,"json"),m.Zb(),m.Zb(),m.Zb()),2&e){var i=t.$implicit;m.wc("@.disabled",t.animation.fromRender)("@detailExpand",void 0),m.Hb(5),m.Tc(m.rc(6,3,i))}}var z,T,W=((T=function t(i){var a=this;e(this,t),this.datasource=i,this.columns=Object(s.r)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=Object(s.s)().onTrigger(function(){return a.datasource.getPeople(100,500)}).create(),this.rowClassUpdate=function(e){if(200===e.dsIndex)return"big-row"}}).\u0275fac=function(e){return new(e||T)(m.Ub(u.a))},T.\u0275cmp=m.Ob({type:T,selectors:[["pbl-dynamic-size-example"]],decls:3,vars:3,consts:[["detailRow","","vScrollDynamic","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"],["row","","matRipple","",4,"pblNgridDetailRowParentRef"],["class","pbl-detail-row",4,"pblNgridDetailRowDef","pblNgridDetailRowDefHasAnimation"],["row","","matRipple",""],[1,"pbl-detail-row"]],template:function(e,t){1&e&&(m.ac(0,"pbl-ngrid",0),m.Qc(1,R,1,0,"pbl-ngrid-row",1),m.Qc(2,D,7,5,"div",2),m.Zb()),2&e&&(m.wc("dataSource",t.ds)("columns",t.columns),m.Hb(2),m.wc("pblNgridDetailRowDefHasAnimation","interaction"))},directives:[h.a,v.b,x.a,y.c,y.b,S.a],pipes:[r.j],styles:[".big-row{height:600px}"],encapsulation:2,data:{animation:[Object(O.m)("detailExpand",[Object(O.j)("void",Object(O.k)({height:"0px",minHeight:"0",visibility:"hidden"})),Object(O.j)("*",Object(O.k)({height:"*",visibility:"visible"})),Object(O.l)("void <=> *",Object(O.e)("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))])]},changeDetection:0}),T=Object(o.a)([Object(d.e)("pbl-dynamic-size-example",{title:"Dynamic Size"}),Object(o.b)("design:paramtypes",[u.a])],T)),P=((z=function t(){e(this,t)}).\u0275fac=function(e){return new(e||z)},z.\u0275mod=m.Sb({type:z}),z.\u0275inj=m.Rb({imports:[[p.i,r.c,b.a,s.j,l.a]]}),z=Object(o.a)([Object(d.a)(g,j,W)],z))},WPM6:function(t,i,a){"use strict";a.d(i,"a",function(){return p});var n=a("XiUz"),c=a("znSr"),o=a("YT2F"),r=a("fXoL"),p=function(){var t=function t(){e(this,t)};return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=r.Sb({type:t}),t.\u0275inj=r.Rb({imports:[[n.e,c.b,o.l],n.e,c.b,o.l]}),t}()}}])}();