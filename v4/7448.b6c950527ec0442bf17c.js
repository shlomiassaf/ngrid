(self.webpackChunkpebula=self.webpackChunkpebula||[]).push([[7448],{70946:(e,t,s)=>{"use strict";s.d(t,{a:()=>c});var i=s(3722),r=s(20377),o=s(91668),n=s(31572);let c=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.oAB({type:e}),e.\u0275inj=n.cJS({imports:[[i.ae,r.aT,o.RF],i.ae,r.aT,o.RF]}),e})()},87448:(e,t,s)=>{"use strict";s.r(t),s.d(t,{TransposeExampleModule:()=>w});var i=s(64762),r=s(61511),o=s(29236),n=s(64914),c=s(30986),l=s(89393),a=s(91668),d=s(70946),p=s(46418),u=s(31572),b=s(88853),g=s(31486),h=s(4198),m=s(55992);function f(e,t){if(1&e&&(u.TgZ(0,"div"),u._uU(1),u.ALo(2,"date"),u.qZA()),2&e){const e=t.value,s=t.col;u.xp6(1),u.Oqu(u.xi3(2,1,e,s.type.data.format))}}function k(e,t){if(1&e&&(u.TgZ(0,"div",4),u._uU(1),u.qZA()),2&e){const e=t.value;u.xp6(1),u.Oqu(e)}}let y=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=(0,n.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:{name:"date",data:{format:"dd MMM, yyyy"}}}).build(),this.ds=(0,n.AV)().onTrigger(()=>this.datasource.getPeople(0,5)).create(),this.transposeToggle=!1}};return e.\u0275fac=function(t){return new(t||e)(u.Y36(p.BQ))},e.\u0275cmp=u.Xpm({type:e,selectors:[["pbl-transpose-example"]],decls:5,vars:6,consts:[["blockUi","",3,"transpose","dataSource","columns"],[4,"pblNgridCellTypeDef"],["style","background: green",4,"pblNgridCellDef"],[3,"checked","change"],[2,"background","green"]],template:function(e,t){1&e&&(u.TgZ(0,"pbl-ngrid",0),u.YNc(1,f,3,4,"div",1),u.YNc(2,k,2,1,"div",2),u.qZA(),u.TgZ(3,"mat-checkbox",3),u.NdJ("change",function(e){return t.transposeToggle=e.checked}),u._uU(4,"Transpose Enabled"),u.qZA()),2&e&&(u.Q6J("transpose",t.transposeToggle)("dataSource",t.ds)("columns",t.columns),u.xp6(1),u.Q6J("pblNgridCellTypeDef","date"),u.xp6(1),u.Q6J("pblNgridCellDef","name"),u.xp6(1),u.Q6J("checked",t.transposeToggle))},directives:[b.eZ,g.C,h.f,m.I,o.oG],pipes:[r.uU],styles:[""],encapsulation:2,changeDetection:0}),e=(0,i.gn)([(0,a.en)("pbl-transpose-example",{title:"Transpose"}),(0,i.w6)("design:paramtypes",[p.BQ])],e),e})();function _(e,t){if(1&e&&(u.TgZ(0,"div",2),u._uU(1),u.qZA()),2&e){const e=t.value;u.xp6(1),u.Oqu(e)}}let U=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=(0,n.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:{name:"date",data:{format:"dd MMM, yyyy"}}}).build(),this.ds=(0,n.AV)().onTrigger(()=>this.datasource.getPeople(0,15)).create()}};return e.\u0275fac=function(t){return new(t||e)(u.Y36(p.BQ))},e.\u0275cmp=u.Xpm({type:e,selectors:[["pbl-original-templates-example"]],decls:2,vars:3,consts:[["blockUi","","transpose","","matchTemplates","",3,"dataSource","columns"],["style","background: green",4,"pblNgridCellDef"],[2,"background","green"]],template:function(e,t){1&e&&(u.TgZ(0,"pbl-ngrid",0),u.YNc(1,_,2,1,"div",1),u.qZA()),2&e&&(u.Q6J("dataSource",t.ds)("columns",t.columns),u.xp6(1),u.Q6J("pblNgridCellDef","name"))},directives:[b.eZ,g.C,h.f,m.I],styles:[""],encapsulation:2,changeDetection:0}),e=(0,i.gn)([(0,a.en)("pbl-original-templates-example",{title:"Transpose with Original Templates"}),(0,i.w6)("design:paramtypes",[p.BQ])],e),e})();function v(e,t){if(1&e&&(u.TgZ(0,"div",2),u._uU(1),u.qZA()),2&e){const e=t.value;u.xp6(1),u.Oqu(e)}}const T=function(){return{minWidth:100}};let x=(()=>{let e=class{constructor(e){this.datasource=e,this.columns=(0,n.I7)().default({minWidth:100}).table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px"},{prop:"birthdate",type:{name:"date",data:{format:"dd MMM, yyyy"}}}).build(),this.ds=(0,n.AV)().onTrigger(()=>this.datasource.getPeople(0,25)).create()}};return e.\u0275fac=function(t){return new(t||e)(u.Y36(p.BQ))},e.\u0275cmp=u.Xpm({type:e,selectors:[["pbl-with-column-styles-example"]],decls:2,vars:5,consts:[["blockUi","","transpose","",3,"transposeDefaultCol","dataSource","columns"],["style","background: green",4,"pblNgridCellDef"],[2,"background","green"]],template:function(e,t){1&e&&(u.TgZ(0,"pbl-ngrid",0),u.YNc(1,v,2,1,"div",1),u.qZA()),2&e&&(u.Q6J("transposeDefaultCol",u.DdM(4,T))("dataSource",t.ds)("columns",t.columns),u.xp6(1),u.Q6J("pblNgridCellDef","name"))},directives:[b.eZ,g.C,h.f,m.I],styles:[""],encapsulation:2,changeDetection:0}),e=(0,i.gn)([(0,a.en)("pbl-with-column-styles-example",{title:"With Column Styles"}),(0,i.w6)("design:paramtypes",[p.BQ])],e),e})(),w=(()=>{let e=class{};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=u.oAB({type:e}),e.\u0275inj=u.cJS({imports:[[r.ez,o.p9,d.a,n.dC,c.L,l.sj]]}),e=(0,i.gn)([(0,a.qB)(y,U,x)],e),e})()},89393:(e,t,s)=>{"use strict";s.d(t,{sj:()=>l}),s(90366);var i=s(31486),r=s(61511),o=s(20531),n=s(64914),c=s(31572);let l=(()=>{class e{}return e.NGRID_PLUGIN=(0,n.Ic)({id:i.d},i.C),e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.oAB({type:e}),e.\u0275inj=c.cJS({imports:[[r.ez,o.HT,n.dC]]}),e})()},31486:(e,t,s)=>{"use strict";s.d(t,{d:()=>l,C:()=>a});var i=s(4710),r=s(19861),o=s(7997),n=s(64914),c=s(31572);const l="blockUi";let a=(()=>{class e{constructor(e,t){this.grid=e,this._blockInProgress=!1,this._removePlugin=t.setPlugin(l,this),e.registry.changes.subscribe(e=>{for(const t of e)switch(t.type){case"blocker":this.setupBlocker()}}),t.onInit().subscribe(e=>{e&&this._blockUi&&"boolean"==typeof this._blockUi&&this.setupBlocker()}),t.events.subscribe(e=>{if("onDataSource"===e.kind){const{prev:t,curr:s}=e;t&&o.dW.kill(this,t),s.onSourceChanging.pipe((0,o.dW)(this,s)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!0,this.setupBlocker())}),s.onSourceChanged.pipe((0,o.dW)(this,s)).subscribe(()=>{"auto"===this._blockUi&&(this._blockInProgress=!1,this.setupBlocker())})}})}get blockUi(){return this._blockUi}set blockUi(e){let t=(0,r.Ig)(e);!t||"auto"!==e&&""!==e||(t="auto"),(0,i.b)(e)&&this._blockUi!==e?((0,i.b)(this._blockUi)&&o.dW.kill(this,this._blockUi),this._blockUi=e,e.pipe((0,o.dW)(this,this._blockUi)).subscribe(e=>{this._blockInProgress=e,this.setupBlocker()})):this._blockUi!==t&&(this._blockUi=t,"auto"!==t&&(this._blockInProgress=t,this.setupBlocker()))}ngOnDestroy(){o.dW.kill(this),this._removePlugin(this.grid)}setupBlocker(){if(this.grid.isInit)if(this._blockInProgress){if(!this._blockerEmbeddedVRef){const e=this.grid.registry.getSingle("blocker");e&&(this._blockerEmbeddedVRef=this.grid.createView("afterContent",e.tRef,{$implicit:this.grid}),this._blockerEmbeddedVRef.detectChanges())}}else this._blockerEmbeddedVRef&&(this.grid.removeView(this._blockerEmbeddedVRef,"afterContent"),this._blockerEmbeddedVRef=void 0)}}return e.\u0275fac=function(t){return new(t||e)(c.Y36(n.eZ),c.Y36(n.q5))},e.\u0275dir=c.lG2({type:e,selectors:[["pbl-ngrid","blockUi",""]],inputs:{blockUi:"blockUi"},exportAs:["blockUi"]}),e})()},90366:(e,t,s)=>{"use strict";s.d(t,{r:()=>o});var i=s(64914),r=s(31572);let o=(()=>{class e extends i.iT{constructor(e,t){super(e,t),this.kind="blocker"}}return e.\u0275fac=function(t){return new(t||e)(r.Y36(r.Rgc),r.Y36(i.B6))},e.\u0275dir=r.lG2({type:e,selectors:[["","pblNgridBlockUiDef",""]],features:[r.qOj]}),e})()}}]);