!function(){function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[54],{"+CUP":function(e,n,a){"use strict";a.r(n),a.d(n,"RowClassExampleModule",function(){return f});var s,o,r=a("mrSG"),c=a("XEBs"),i=a("YT2F"),u=a("WPM6"),l=a("fluT"),p=a("fXoL"),d=a("XkVd"),b=((o=function e(n){var a=this;t(this,e),this.datasource=n,this.columns=Object(c.r)().table({prop:"name",width:"100px"},{prop:"gender",width:"50px"},{prop:"birthdate",type:"date",width:"25%"}).build(),this.ds=Object(c.s)().onTrigger(function(){return a.datasource.getPeople(100,500)}).create(),this.rowClassUpdate=function(t){if(t.$implicit.name.length>14)return"row-class-name-length-gt-14"}}).\u0275fac=function(t){return new(t||o)(p.Ub(l.a))},o.\u0275cmp=p.Ob({type:o,selectors:[["pbl-row-class-example"]],decls:1,vars:3,consts:[[3,"dataSource","columns","rowClassUpdate"]],template:function(t,e){1&t&&p.Vb(0,"pbl-ngrid",0),2&t&&p.wc("dataSource",e.ds)("columns",e.columns)("rowClassUpdate",e.rowClassUpdate)},directives:[d.a],styles:[".row-class-name-length-gt-14{background:red}"],encapsulation:2,changeDetection:0}),o=Object(r.a)([Object(i.e)("pbl-row-class-example",{title:"Row Class"}),Object(r.b)("design:paramtypes",[l.a])],o)),f=((s=function e(){t(this,e)}).\u0275fac=function(t){return new(t||s)},s.\u0275mod=p.Sb({type:s}),s.\u0275inj=p.Rb({imports:[[u.a,c.j]]}),s=Object(r.a)([Object(i.a)(b)],s))},WPM6:function(e,n,a){"use strict";a.d(n,"a",function(){return i});var s=a("XiUz"),o=a("znSr"),r=a("YT2F"),c=a("fXoL"),i=function(){var e=function e(){t(this,e)};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=c.Sb({type:e}),e.\u0275inj=c.Rb({imports:[[s.e,o.b,r.l],s.e,o.b,r.l]}),e}()}}])}();