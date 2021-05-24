!function(){function e(e){return function(e){if(Array.isArray(e))return n(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,r){if(!e)return;if("string"==typeof e)return n(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return n(e,r)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,n){(null==n||n>e.length)&&(n=e.length);for(var r=0,t=new Array(n);r<n;r++)t[r]=e[r];return t}function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function t(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}function o(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}!function(e){self.webpackChunk=function(n,t){for(var o in t)e[o]=t[o];for(;n.length;)r[n.pop()]=1};var n={},r={0:1};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.e=function(e){var n=[];return n.push(Promise.resolve().then(function(){r[e]||importScripts(t.p+""+({}[e]||e)+"-es2015."+{1:"e9da9729c86b11547b51"}[e]+".worker.js")})),Promise.all(n)},t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,(function(n){return e[n]}).bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="/ngrid/v3/",t(t.s="1SwI")}({"1SwI":function(n,t,a){"use strict";function i(){return a.e(1).then(a.t.bind(null,"NZy3",7))}a.r(t),a.d(t,"DatasourceStore",function(){return s}),Error;var u=function(){function e(){r(this,e),this.customers=[],this.people=[],this.sellers=[]}return o(e,[{key:"reset",value:function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];for(var t=0,o=n;t<o.length;t++){var a=o[t];this[a]=[]}}},{key:"getCustomersSync",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:500;return this.customers.slice(0,e)}},{key:"getCustomers",value:function(){var e=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:500;return this.wait(n).then(function(){return i()}).then(function(n){if(e.customers.length<r)for(var t=e.customers.length;t<r;t++){var o={id:t+1,name:n.name.findName(),country:n.address.countryCode(),jobTitle:n.name.jobTitle(),accountId:n.finance.account(),accountType:n.finance.accountName(),currencyCode:n.finance.currencyCode(),primeAccount:n.random.boolean(),balance:n.random.number({min:-5e4,max:5e4,precision:2}),creditScore:n.random.number(4)+1,monthlyBalance:Array.from(new Array(12)).map(function(){return n.random.number({min:-15e3,max:15e3,precision:2})})};e.customers.push(o)}return e.customers.slice(0,r)})}},{key:"getPeopleSync",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:500;return this.people.slice(0,e)}},{key:"getPeople",value:function(){var e=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:500;return this.wait(n).then(function(){return i()}).then(function(n){if(e.people.length<r)for(var t=e.people.length;t<r;t++){var o={id:t,name:n.name.findName(),email:n.internet.email(),gender:n.random.arrayElement(["Male","Female"]),country:n.address.countryCode(),birthdate:n.date.past().toISOString(),bio:n.lorem.paragraph(),language:"EN",lead:n.random.boolean(),balance:n.random.number({min:-2e4,max:2e4,precision:2}),settings:{background:n.internet.color(),timezone:"UTC",emailFrequency:n.random.arrayElement(["Daily","Weekly","Yearly","Often","Seldom","Never"]),avatar:n.image.avatar()},lastLoginIp:n.internet.ip()};e.people.push(o)}return e.people.slice(0,r)})}},{key:"getSellersSync",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:500;return this.sellers.slice(0,e)}},{key:"getSellers",value:function(){var e=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1e3,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:500;return this.wait(n).then(function(){return i()}).then(function(n){if(e.sellers.length<r)for(var t=e.sellers.length;t<r;t++){var o={id:t,name:n.name.findName(),company:n.company.companyName(),department:n.commerce.department(),country:n.address.countryCode(),email:n.internet.email(),sales:n.random.number({min:0,max:2e5,precision:2}),rating:n.random.number(4)+1,feedback:n.random.number({min:5,max:100}),address:[n.address.streetAddress(),n.address.city(),n.address.stateAbbr(),n.address.zipCode()].join(", ")};e.sellers.push(o)}return e.sellers.slice(0,r)})}},{key:"wait",value:function(e){return new Promise(function(n){setTimeout(n,e)})}}]),e}(),s=function(){function n(){r(this,n),this.store=new u}return o(n,[{key:"onMessage",value:function(n){var r,t=n.data,o=n.ports;if(t&&o&&o.length){var a,i=o[0];switch(t.action){case"getCustomers":case"getPeople":case"getSellers":var u=t.data;a=this.store[t.action](u.delay,u.limit);break;case"reset":(r=this.store).reset.apply(r,e(t.data.type))}a&&a.then(function(e){return i.postMessage(e)}).catch(function(e){return i.postMessage(function(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r={error:{name:e.name,message:e.message}};return n&&(r.error.stack=e.stack),r}(e))})}}}]),n}(),c=new s;addEventListener("message",function(e){c.onMessage(e)}),postMessage("ready")}})}();