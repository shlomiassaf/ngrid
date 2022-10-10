(()=>{"use strict";var s,r,d={},m={};function o(r){var s=m[r];if(void 0!==s)return s.exports;var e=m[r]={exports:{}};return d[r](e,e.exports,o),e.exports}function l(){return o.e(4664).then(o.t.bind(o,4664,23))}o.m=d,r=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,o.t=function(e,t){if(1&t&&(e=this(e)),8&t||"object"==typeof e&&e&&(4&t&&e.__esModule||16&t&&"function"==typeof e.then))return e;var n=Object.create(null);o.r(n);var a={};s=s||[null,r({}),r([]),r(r)];for(var i=2&t&&e;"object"==typeof i&&!~s.indexOf(i);i=r(i))Object.getOwnPropertyNames(i).forEach(c=>a[c]=()=>e[c]);return a.default=()=>e,o.d(n,a),n},o.d=(r,s)=>{for(var e in s)o.o(s,e)&&!o.o(r,e)&&Object.defineProperty(r,e,{enumerable:!0,get:s[e]})},o.f={},o.e=r=>Promise.all(Object.keys(o.f).reduce((s,e)=>(o.f[e](r,s),s),[])),o.u=r=>r+".cc504cfc7c913e57.js",o.miniCssF=r=>{},o.o=(r,s)=>Object.prototype.hasOwnProperty.call(r,s),o.r=r=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},(()=>{var r;o.tt=()=>(void 0===r&&(r={createScriptURL:s=>s},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(r=trustedTypes.createPolicy("angular#bundler",r))),r)})(),o.tu=r=>o.tt().createScriptURL(r),o.p="/ngrid/",(()=>{var r={9738:1};o.f.i=(n,a)=>{r[n]||importScripts(o.tu(o.p+o.u(n)))};var e=self.webpackChunkngrid_docs_app=self.webpackChunkngrid_docs_app||[],t=e.push.bind(e);e.push=n=>{var[a,i,c]=n;for(var u in i)o.o(i,u)&&(o.m[u]=i[u]);for(c&&c(o);a.length;)r[a.pop()]=1;t(n)}})(),Error;class y{constructor(){this.customers=[],this.people=[],this.sellers=[]}reset(...s){for(const e of s)this[e]=[]}getCustomersSync(s=500){return this.customers.slice(0,s)}getCustomers(s=1e3,e=500){return this.wait(s).then(()=>l()).then(t=>{if(this.customers.length<e)for(let n=this.customers.length;n<e;n++){const a={id:n+1,name:t.name.findName(),country:t.address.countryCode(),jobTitle:t.name.jobTitle(),accountId:t.finance.account(),accountType:t.finance.accountName(),currencyCode:t.finance.currencyCode(),primeAccount:t.datatype.boolean(),balance:t.datatype.number({min:-5e4,max:5e4,precision:2}),creditScore:t.datatype.number(4)+1,monthlyBalance:Array.from(new Array(12)).map(()=>t.datatype.number({min:-15e3,max:15e3,precision:2}))};this.customers.push(a)}return this.customers.slice(0,e)})}getPeopleSync(s=500){return this.people.slice(0,s)}getPeople(s=1e3,e=500){return this.wait(s).then(()=>l()).then(t=>{if(this.people.length<e)for(let n=this.people.length;n<e;n++){const a={id:n,name:t.name.findName(),email:t.internet.email(),gender:t.random.arrayElement(["Male","Female"]),country:t.address.countryCode(),birthdate:t.date.past().toISOString(),bio:t.lorem.paragraph(),language:"EN",lead:t.datatype.boolean(),balance:t.datatype.number({min:-2e4,max:2e4,precision:2}),settings:{background:t.internet.color(),timezone:"UTC",emailFrequency:t.random.arrayElement(["Daily","Weekly","Yearly","Often","Seldom","Never"]),avatar:t.image.avatar()},lastLoginIp:t.internet.ip()};this.people.push(a)}return this.people.slice(0,e)})}getSellersSync(s=500){return this.sellers.slice(0,s)}getSellers(s=1e3,e=500){return this.wait(s).then(()=>l()).then(t=>{if(this.sellers.length<e)for(let n=this.sellers.length;n<e;n++){const a={id:n,name:t.name.findName(),company:t.company.companyName(),department:t.commerce.department(),country:t.address.countryCode(),email:t.internet.email(),sales:t.datatype.number({min:0,max:2e5,precision:2}),rating:t.datatype.number(4)+1,feedback:t.datatype.number({min:5,max:100}),address:[t.address.streetAddress(),t.address.city(),t.address.stateAbbr(),t.address.zipCode()].join(", ")};this.sellers.push(a)}return this.sellers.slice(0,e)})}wait(s){return new Promise(e=>{setTimeout(e,s)})}}const b=new class g{constructor(){this.store=new y}onMessage(s){const{data:e,ports:t}=s;if(!e||!t||!t.length)return;const n=t[0];let a;switch(e.action){case"getCustomers":case"getPeople":case"getSellers":const c=e.data;a=this.store[e.action](c.delay,c.limit);break;case"reset":this.store.reset(...e.data.type)}a&&a.then(i=>n.postMessage(i)).catch(i=>n.postMessage(function h(r,s=!0){const e={error:{name:r.name,message:r.message}};return s&&(e.error.stack=r.stack),e}(i)))}};addEventListener("message",r=>{b.onMessage(r)}),postMessage("ready")})();