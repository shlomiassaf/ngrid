(window.webpackJsonp=window.webpackJsonp||[]).push([[72],{"5WfE":function(t,e,s){"use strict";s.r(e),s.d(e,"CellTooltipExampleModule",function(){return y});var i=s("mrSG"),o=s("ofXK"),l=s("1kSV"),n=s("DcT9"),c=s("XEBs"),a=s("4dOD"),r=s("fXoL"),p=s("8LU1");const h={canShow:t=>{const e=t.cellTarget.firstElementChild||t.cellTarget;return e.scrollWidth>e.offsetWidth},message:t=>t.cellTarget.innerText};let b=(()=>{class t{constructor(t,e,s){this.table=t,this.injector=e,this._removePlugin=s.setPlugin("bsCellTooltip",this);const i=e.get(n.j);this.initArgs=[e.get(r.J),e,e.get(r.j),e.get(r.V),e.get(l.g),e.get(r.E),e.get(o.e),e.get(r.h),e.get(r.g)],i.onUpdate("bsCellTooltip").pipe(Object(n.q)(this)).subscribe(t=>this.lastConfig=t.curr),s.onInit().subscribe(()=>this.init(s))}set canShow(t){this._canShow="function"==typeof t?t:""===t?void 0:Object(p.c)(t)?t=>!0:t=>!1}static create(e,s){return new t(e,s,c.m.find(e))}ngOnDestroy(){this._removePlugin(this.table),this.killTooltip(),n.q.kill(this)}init(t){const e=t.getPlugin("targetEvents")||t.createPlugin("targetEvents");e.cellEnter.pipe(Object(n.q)(this)).subscribe(t=>this.cellEnter(t)),e.cellLeave.pipe(Object(n.q)(this)).subscribe(t=>this.cellLeave(t))}cellEnter(t){if(this.killTooltip(),this._canShow||(this.canShow=this.lastConfig&&this.lastConfig.canShow||h.canShow),this._canShow(t)){const e=this.initArgs.slice();this.toolTip=new l.f(new r.m(t.cellTarget),...e),this.toolTip.container="body",this.toolTip.ngbTooltip=(this.message||this.lastConfig&&this.lastConfig.message||h.message)(t),this.tooltipClass&&(this.toolTip.tooltipClass=this.tooltipClass),this.showDelay>=0&&(this.toolTip.openDelay=this.showDelay),this.hideDelay>=0&&(this.toolTip.closeDelay=this.hideDelay),this.toolTip.open()}}cellLeave(t){this.killTooltip()}killTooltip(){this.toolTip&&(this.toolTip.close(),this.toolTip.ngOnDestroy(),this.toolTip=void 0)}}return t.PLUGIN_KEY="bsCellTooltip",t.\u0275fac=function(e){return new(e||t)(r.Ub(c.f),r.Ub(r.v),r.Ub(c.m))},t.\u0275dir=r.Pb({type:t,selectors:[["","bsCellTooltip",""]],inputs:{canShow:["bsCellTooltip","canShow"],message:"message",tooltipClass:"tooltipClass",showDelay:"showDelay",hideDelay:"hideDelay"},exportAs:["bsCellTooltip"]}),t})(),u=(()=>{class t{constructor(t,e){t||c.m.created.subscribe(t=>{const s=e.get(b.PLUGIN_KEY);if(s&&!0===s.autoSetAll){const e=t.controller;e.onInit().subscribe(t=>e.ensurePlugin(b.PLUGIN_KEY))}})}}return t.NGRID_PLUGIN=Object(c.u)({id:"bsCellTooltip",factory:"create"},b),t.\u0275fac=function(e){return new(e||t)(r.hc(t,12),r.hc(n.j))},t.\u0275mod=r.Sb({type:t}),t.\u0275inj=r.Rb({imports:[[o.c,l.h,c.j,a.a],l.h]}),t})();var g=s("YT2F"),d=s("WPM6"),T=s("9Q/P"),f=s("fluT"),w=s("XkVd");let m=(()=>{let t=class{constructor(t){this.datasource=t,this.columns=Object(c.r)().table({prop:"id",sort:!0,width:"40px"},{prop:"name",sort:!0},{prop:"gender",width:"50px",sort:!0},{prop:"birthdate",type:"date"},{prop:"bio"}).build(),this.ds=Object(c.s)().onTrigger(()=>this.datasource.getPeople(100,500)).create()}};return t.\u0275fac=function(e){return new(e||t)(r.Ub(f.a))},t.\u0275cmp=r.Ob({type:t,selectors:[["pbl-bs-cell-tooltip-example"]],decls:1,vars:2,consts:[["bsCellTooltip","",1,"pbl-ngrid-cell-ellipsis",3,"dataSource","columns"]],template:function(t,e){1&t&&r.Vb(0,"pbl-ngrid",0),2&t&&r.wc("dataSource",e.ds)("columns",e.columns)},directives:[w.a,b],styles:[""],encapsulation:2,changeDetection:0}),t=Object(i.a)([Object(g.e)("pbl-bs-cell-tooltip-example",{title:"Cell Tooltip"}),Object(i.b)("design:paramtypes",[f.a])],t),t})(),y=(()=>{let t=class{};return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=r.Sb({type:t}),t.\u0275inj=r.Rb({imports:[[T.a,d.a,c.j,u]]}),t=Object(i.a)([Object(g.a)(m)],t),t})()}}]);