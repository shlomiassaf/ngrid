"use strict";(self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[]).push([[5341],{27569:(D,x,i)=>{i.d(x,{a:()=>v});var l=i(77093),g=i(23322),h=i(88562),d=i(5e3);let v=(()=>{class n{}return n.\u0275fac=function(p){return new(p||n)},n.\u0275mod=d.oAB({type:n}),n.\u0275inj=d.cJS({imports:[l.ae,g.aT,h.RF,l.ae,g.aT,h.RF]}),n})()},45341:(D,x,i)=>{i.r(x),i.d(x,{StrategiesExampleModule:()=>s});var l=i(70655),g=i(69808),h=i(90508),d=i(14625),v=i(26803),n=i(88562),f=i(27569),p=i(50841),e=i(5e3),z=i(50055),E=i(37048);let r=class{constructor(t){this.datasource=t,this.columns=(0,d.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=(0,d.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};r.\u0275fac=function(t){return new(t||r)(e.Y36(p.BQ))},r.\u0275cmp=e.Xpm({type:r,selectors:[["pbl-fixed-size-example"]],decls:1,vars:2,consts:[["vScrollFixed","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"]],template:function(t,o){1&t&&e._UZ(0,"pbl-ngrid",0),2&t&&e.Q6J("dataSource",o.ds)("columns",o.columns)},dependencies:[z.R,E.eZ],encapsulation:2,changeDetection:0}),r=(0,l.gn)([(0,n.en)("pbl-fixed-size-example",{title:"Fixed Size"}),(0,l.w6)("design:paramtypes",[p.BQ])],r);var b=i(96614);let m=class{constructor(t){this.datasource=t,this.columns=(0,d.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=(0,d.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};m.\u0275fac=function(t){return new(t||m)(e.Y36(p.BQ))},m.\u0275cmp=e.Xpm({type:m,selectors:[["pbl-auto-size-example"]],decls:1,vars:2,consts:[["vScrollAuto","",3,"dataSource","columns"]],template:function(t,o){1&t&&e._UZ(0,"pbl-ngrid",0),2&t&&e.Q6J("dataSource",o.ds)("columns",o.columns)},dependencies:[b.B,E.eZ],encapsulation:2,changeDetection:0}),m=(0,l.gn)([(0,n.en)("pbl-auto-size-example",{title:"Auto Size"}),(0,l.w6)("design:paramtypes",[p.BQ])],m);var c=i(41777),T=i(27205),A=i(13719),w=i(90858),y=i(43789);function B(a,t){1&a&&e._UZ(0,"pbl-ngrid-row",3)}function R(a,t){if(1&a){const o=e.EpF();e.TgZ(0,"div",4),e.NdJ("@detailExpand.done",function(){const M=e.CHM(o).animation;return e.KtG(M.end())}),e.TgZ(1,"div")(2,"h1"),e._uU(3,"Detail Row"),e.qZA(),e.TgZ(4,"pre"),e._uU(5),e.ALo(6,"json"),e.qZA()()()}if(2&a){const o=t.$implicit;e.Q6J("@.disabled",t.animation.fromRender)("@detailExpand",void 0),e.xp6(5),e.Oqu(e.lcZ(6,3,o))}}let u=class{constructor(t){this.datasource=t,this.columns=(0,d.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date"},{prop:"bio"},{prop:"email",minWidth:250,width:"250px"},{prop:"language",headerType:"language"}).build(),this.ds=(0,d.AV)().onTrigger(()=>this.datasource.getPeople(100,500)).create(),this.rowClassUpdate=o=>{if(200===o.dsIndex)return"big-row"}}};u.\u0275fac=function(t){return new(t||u)(e.Y36(p.BQ))},u.\u0275cmp=e.Xpm({type:u,selectors:[["pbl-dynamic-size-example"]],decls:3,vars:3,consts:[["detailRow","","vScrollDynamic","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"],["row","","matRipple","",4,"pblNgridDetailRowParentRef"],["class","pbl-detail-row",4,"pblNgridDetailRowDef","pblNgridDetailRowDefHasAnimation"],["row","","matRipple",""],[1,"pbl-detail-row"]],template:function(t,o){1&t&&(e.TgZ(0,"pbl-ngrid",0),e.YNc(1,B,1,0,"pbl-ngrid-row",1),e.YNc(2,R,7,5,"div",2),e.qZA()),2&t&&(e.Q6J("dataSource",o.ds)("columns",o.columns),e.xp6(2),e.Q6J("pblNgridDetailRowDefHasAnimation","interaction"))},dependencies:[T.w,A.U,E.eZ,w.ml,y.N,y.A,g.Ts],styles:[".big-row{height:600px}\n"],encapsulation:2,data:{animation:[(0,c.X$)("detailExpand",[(0,c.SB)("void",(0,c.oB)({height:"0px",minHeight:"0",visibility:"hidden"})),(0,c.SB)("*",(0,c.oB)({height:"*",visibility:"visible"})),(0,c.eR)("void <=> *",(0,c.jt)("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"))])]},changeDetection:0}),u=(0,l.gn)([(0,n.en)("pbl-dynamic-size-example",{title:"Dynamic Size"}),(0,l.w6)("design:paramtypes",[p.BQ])],u);let s=class{};s.\u0275fac=function(t){return new(t||s)},s.\u0275mod=e.oAB({type:s}),s.\u0275inj=e.cJS({imports:[h.BQ,g.ez,f.a,d.dC,v.z6]}),s=(0,l.gn)([(0,n.qB)(r,m,u)],s)}}]);