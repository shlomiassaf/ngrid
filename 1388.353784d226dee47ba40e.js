(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[1388],{70946:(e,t,i)=>{"use strict";i.d(t,{a:()=>p});var a=i(3722),n=i(20377),r=i(91668),o=i(31572);let p=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=o.oAB({type:e}),e.\u0275inj=o.cJS({imports:[[a.ae,n.aT,r.RF],a.ae,n.aT,r.RF]}),e})()},1388:(e,t,i)=>{"use strict";i.r(t),i.d(t,{StrategiesExampleModule:()=>B});var a=i(64762),n=i(61511),r=i(71522),o=i(64914),p=i(91931),l=i(91668),s=i(70946),d=i(46418),c=i(31572),u=i(88853),m=i(28861);let g=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=(0,o.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=(0,o.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};return e.\u0275fac=function(t){return new(t||e)(c.Y36(d.BQ))},e.\u0275cmp=c.Xpm({type:e,selectors:[["pbl-fixed-size-example"]],decls:1,vars:2,consts:[["vScrollFixed","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"]],template:function(e,t){1&e&&c._UZ(0,"pbl-ngrid",0),2&e&&c.Q6J("dataSource",t.ds)("columns",t.columns)},directives:[u.eZ,m.R],styles:[""],encapsulation:2,changeDetection:0}),e=(0,a.gn)([(0,l.en)("pbl-fixed-size-example",{title:"Fixed Size"}),(0,a.w6)("design:paramtypes",[d.BQ])],e),e})();var h=i(2367);let b=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=(0,o.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=(0,o.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};return e.\u0275fac=function(t){return new(t||e)(c.Y36(d.BQ))},e.\u0275cmp=c.Xpm({type:e,selectors:[["pbl-auto-size-example"]],decls:1,vars:2,consts:[["vScrollAuto","",3,"dataSource","columns"]],template:function(e,t){1&e&&c._UZ(0,"pbl-ngrid",0),2&e&&c.Q6J("dataSource",t.ds)("columns",t.columns)},directives:[u.eZ,h.B],styles:[""],encapsulation:2,changeDetection:0}),e=(0,a.gn)([(0,l.en)("pbl-auto-size-example",{title:"Auto Size"}),(0,a.w6)("design:paramtypes",[d.BQ])],e),e})();var w=i(10709),f=i(59670),x=i(90814),y=i(62866),v=i(84557);function S(e,t){1&e&&c._UZ(0,"pbl-ngrid-row",3)}function Z(e,t){if(1&e&&(c.TgZ(0,"div",4),c.NdJ("@detailExpand.done",function(){return t.animation.end()}),c.TgZ(1,"div"),c.TgZ(2,"h1"),c._uU(3,"Detail Row"),c.qZA(),c.TgZ(4,"pre"),c._uU(5),c.ALo(6,"json"),c.qZA(),c.qZA(),c.qZA()),2&e){const e=t.$implicit;c.Q6J("@.disabled",t.animation.fromRender)("@detailExpand",void 0),c.xp6(5),c.Oqu(c.lcZ(6,3,e))}}let A=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=(0,o.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=(0,o.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create(),this.rowClassUpdate=e=>{if(200===e.dsIndex)return"big-row"}}};return e.\u0275fac=function(t){return new(t||e)(c.Y36(d.BQ))},e.\u0275cmp=c.Xpm({type:e,selectors:[["pbl-dynamic-size-example"]],decls:3,vars:3,consts:[["detailRow","","vScrollDynamic","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"],["row","","matRipple","",4,"pblNgridDetailRowParentRef"],["class","pbl-detail-row",4,"pblNgridDetailRowDef","pblNgridDetailRowDefHasAnimation"],["row","","matRipple",""],[1,"pbl-detail-row"]],template:function(e,t){1&e&&(c.TgZ(0,"pbl-ngrid",0),c.YNc(1,S,1,0,"pbl-ngrid-row",1),c.YNc(2,Z,7,5,"div",2),c.qZA()),2&e&&(c.Q6J("dataSource",t.ds)("columns",t.columns),c.xp6(2),c.Q6J("pblNgridDetailRowDefHasAnimation","interaction"))},directives:[u.eZ,f.ml,x.U,y.NF,y.A_,v.w],pipes:[n.Ts],styles:[".big-row{height:600px}"],encapsulation:2,data:{animation:[(0,w.X$)("detailExpand",[(0,w.SB)("void",(0,w.oB)({height:"0px",minHeight:"0",visibility:"hidden"})),(0,w.SB)("*",(0,w.oB)({height:"*",visibility:"visible"})),(0,w.eR)("void <=> *",(0,w.jt)("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))])]},changeDetection:0}),e=(0,a.gn)([(0,l.en)("pbl-dynamic-size-example",{title:"Dynamic Size"}),(0,a.w6)("design:paramtypes",[d.BQ])],e),e})(),B=(()=>{let e=class{};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({imports:[[r.BQ,n.ez,s.a,o.dC,p.z6]]}),e=(0,a.gn)([(0,l.qB)(g,b,A)],e),e})()}}]);