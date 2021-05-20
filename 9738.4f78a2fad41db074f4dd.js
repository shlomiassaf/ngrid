(()=>{"use strict";var e,t,r={},n={};function s(e){var t=n[e];if(void 0!==t)return t.exports;var a=n[e]={exports:{}};return r[e](a,a.exports,s),a.exports}function a(){return s.e(3210).then(s.t.bind(s,83210,23))}s.m=r,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,s.t=function(r,n){if(1&n&&(r=this(r)),8&n)return r;if("object"==typeof r&&r){if(4&n&&r.__esModule)return r;if(16&n&&"function"==typeof r.then)return r}var a=Object.create(null);s.r(a);var o={};e=e||[null,t({}),t([]),t(t)];for(var i=2&n&&r;"object"==typeof i&&!~e.indexOf(i);i=t(i))Object.getOwnPropertyNames(i).forEach(e=>o[e]=()=>r[e]);return o.default=()=>r,s.d(a,o),a},s.d=(e,t)=>{for(var r in t)s.o(t,r)&&!s.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},s.f={},s.e=e=>Promise.all(Object.keys(s.f).reduce((t,r)=>(s.f[r](e,t),t),[])),s.u=e=>e+".7e44494c19ab5e252a0b.js",s.miniCssF=e=>{},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.p="/ngrid/",(()=>{var e={9738:1};s.f.i=(t,r)=>{e[t]||importScripts(s.p+s.u(t))};var t=self.webpackChunkpebula=self.webpackChunkpebula||[],r=t.push.bind(t);t.push=t=>{var[n,a,o]=t;for(var i in a)s.o(a,i)&&(s.m[i]=a[i]);for(o&&o(s);n.length;)e[n.pop()]=1;r(t)}})(),Error;class o{constructor(){this.customers=[],this.people=[],this.sellers=[]}reset(...e){for(const t of e)this[t]=[]}getCustomersSync(e=500){return this.customers.slice(0,e)}getCustomers(e=1e3,t=500){return this.wait(e).then(()=>a()).then(e=>{if(this.customers.length<t)for(let r=this.customers.length;r<t;r++){const t={id:r+1,name:e.name.findName(),country:e.address.countryCode(),jobTitle:e.name.jobTitle(),accountId:e.finance.account(),accountType:e.finance.accountName(),currencyCode:e.finance.currencyCode(),primeAccount:e.random.boolean(),balance:e.random.number({min:-5e4,max:5e4,precision:2}),creditScore:e.random.number(4)+1,monthlyBalance:Array.from(new Array(12)).map(()=>e.random.number({min:-15e3,max:15e3,precision:2}))};this.customers.push(t)}return this.customers.slice(0,t)})}getPeopleSync(e=500){return this.people.slice(0,e)}getPeople(e=1e3,t=500){return this.wait(e).then(()=>a()).then(e=>{if(this.people.length<t)for(let r=this.people.length;r<t;r++){const t={id:r,name:e.name.findName(),email:e.internet.email(),gender:e.random.arrayElement(["Male","Female"]),country:e.address.countryCode(),birthdate:e.date.past().toISOString(),bio:e.lorem.paragraph(),language:"EN",lead:e.random.boolean(),balance:e.random.number({min:-2e4,max:2e4,precision:2}),settings:{background:e.internet.color(),timezone:"UTC",emailFrequency:e.random.arrayElement(["Daily","Weekly","Yearly","Often","Seldom","Never"]),avatar:e.image.avatar()},lastLoginIp:e.internet.ip()};this.people.push(t)}return this.people.slice(0,t)})}getSellersSync(e=500){return this.sellers.slice(0,e)}getSellers(e=1e3,t=500){return this.wait(e).then(()=>a()).then(e=>{if(this.sellers.length<t)for(let r=this.sellers.length;r<t;r++){const t={id:r,name:e.name.findName(),company:e.company.companyName(),department:e.commerce.department(),country:e.address.countryCode(),email:e.internet.email(),sales:e.random.number({min:0,max:2e5,precision:2}),rating:e.random.number(4)+1,feedback:e.random.number({min:5,max:100}),address:[e.address.streetAddress(),e.address.city(),e.address.stateAbbr(),e.address.zipCode()].join(", ")};this.sellers.push(t)}return this.sellers.slice(0,t)})}wait(e){return new Promise(t=>{setTimeout(t,e)})}}const i=new class{constructor(){this.store=new o}onMessage(e){const{data:t,ports:r}=e;if(!t||!r||!r.length)return;const n=r[0];let s;switch(t.action){case"getCustomers":case"getPeople":case"getSellers":const e=t.data;s=this.store[t.action](e.delay,e.limit);break;case"reset":this.store.reset(...t.data.type)}s&&s.then(e=>n.postMessage(e)).catch(e=>n.postMessage(function(e,t=!0){const r={error:{name:e.name,message:e.message}};return t&&(r.error.stack=e.stack),r}(e)))}};addEventListener("message",e=>{i.onMessage(e)}),postMessage("ready")})();